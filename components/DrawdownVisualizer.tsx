"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { AccountSize, DrawdownDay } from "@/types/plans";
import { drawdownData } from "@/data/plans";

const DrawdownChart = dynamic(() => import("./DrawdownChart"), { ssr: false });

// ── Scale mock data to other account sizes ────────────────────────────────────

const ACCOUNT_CONFIGS: Record<
  AccountSize,
  { startBalance: number; drawdown: number; lockThreshold: number }
> = {
  "25k": { startBalance: 25000, drawdown: 1500, lockThreshold: 26600 },
  "50k": { startBalance: 50000, drawdown: 2000, lockThreshold: 52100 },
  "100k": { startBalance: 100000, drawdown: 3000, lockThreshold: 103100 },
  "150k": { startBalance: 150000, drawdown: 4500, lockThreshold: 154600 },
};

function scaleData(size: AccountSize): DrawdownDay[] {
  const cfg = ACCOUNT_CONFIGS[size];
  const ratio = cfg.startBalance / 50000;
  return drawdownData.map((d) => {
    const endBalance = Math.round(cfg.startBalance + (d.endBalance - 50000) * ratio);
    const prevHighest = Math.max(
      ...drawdownData.slice(0, d.day).map((x) => x.endBalance)
    );
    const scaledHighest = Math.round(cfg.startBalance + (prevHighest - 50000) * ratio);
    const locked = endBalance > cfg.lockThreshold || d.locked;
    const floor = locked
      ? cfg.startBalance - cfg.drawdown + Math.round((cfg.lockThreshold - cfg.startBalance) * ratio * 0.1)
      : scaledHighest - cfg.drawdown;
    return {
      day: d.day,
      startBalance: Math.round(cfg.startBalance + (d.startBalance - 50000) * ratio),
      endBalance,
      drawdownFloor: d.locked
        ? Math.round(cfg.startBalance - cfg.drawdown + Math.round((d.drawdownFloor - 48000) * ratio))
        : Math.max(cfg.startBalance - cfg.drawdown, scaledHighest - cfg.drawdown),
      locked: d.locked,
      annotation: d.annotation,
    };
  });
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  color = "text-text-primary",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#0a0e17] px-4 py-3">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className={`mt-0.5 font-bold ${color}`}>{value}</div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const SIZE_LABELS: Record<AccountSize, string> = {
  "25k": "$25K",
  "50k": "$50K",
  "100k": "$100K",
  "150k": "$150K",
};

export default function DrawdownVisualizer() {
  const [accountSize, setAccountSize] = useState<AccountSize>("50k");
  const [currentDay, setCurrentDay] = useState(10);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const data = accountSize === "50k" ? drawdownData : scaleData(accountSize);
  const cfg = ACCOUNT_CONFIGS[accountSize];
  const visibleData = data.slice(0, currentDay);
  const currentPoint = data[currentDay - 1];

  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    setCurrentDay(1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setCurrentDay((prev) => {
        if (prev >= data.length) {
          stopPlayback();
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, data.length, stopPlayback]);

  // Stop playback when account size changes
  useEffect(() => {
    stopPlayback();
    setCurrentDay(10);
  }, [accountSize, stopPlayback]);

  const handlePlayPause = () => {
    if (playing) {
      stopPlayback();
    } else if (currentDay >= data.length) {
      startPlayback();
    } else {
      setPlaying(true);
    }
  };

  const pnlToday = currentPoint
    ? currentPoint.endBalance - currentPoint.startBalance
    : 0;
  const totalPnl = currentPoint
    ? currentPoint.endBalance - cfg.startBalance
    : 0;
  const distanceToFloor = currentPoint
    ? currentPoint.endBalance - currentPoint.drawdownFloor
    : 0;

  return (
    <section id="drawdown" className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
            Drawdown Visualizer
          </h2>
          <p className="mt-1 text-text-secondary">
            Watch how EOD trailing drawdown works over a simulated 10-day period.
          </p>
        </div>

        {/* Account size toggle */}
        <div className="inline-flex rounded-xl border border-[#1f2937] bg-[#0a0e17] p-1">
          {(Object.keys(SIZE_LABELS) as AccountSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setAccountSize(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                accountSize === s
                  ? "bg-blue-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {SIZE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Main chart card */}
      <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-6">
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill
            label="Starting Balance"
            value={`$${cfg.startBalance.toLocaleString()}`}
          />
          <StatPill
            label="Max Drawdown"
            value={`$${cfg.drawdown.toLocaleString()}`}
            color="text-red-accent"
          />
          <StatPill
            label={`Day ${currentDay} P&L`}
            value={`${pnlToday >= 0 ? "+" : ""}$${Math.abs(pnlToday).toLocaleString()}`}
            color={pnlToday >= 0 ? "text-green-accent" : "text-red-accent"}
          />
          <StatPill
            label="Distance to Floor"
            value={`$${distanceToFloor.toLocaleString()}`}
            color={
              distanceToFloor < cfg.drawdown * 0.3
                ? "text-red-accent"
                : distanceToFloor < cfg.drawdown * 0.6
                ? "text-amber-accent"
                : "text-green-accent"
            }
          />
        </div>

        {/* Chart */}
        <DrawdownChart
          visibleData={visibleData}
          currentDay={currentDay}
          totalDays={data.length}
        />

        {/* Controls */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
                playing
                  ? "bg-amber-accent/10 border border-amber-accent/30 text-amber-accent hover:bg-amber-accent/20"
                  : "bg-blue-accent text-white hover:bg-blue-500 shadow-md shadow-blue-accent/20"
              }`}
            >
              {playing ? (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pause
                </>
              ) : currentDay >= data.length ? (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                  </svg>
                  Replay
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </>
              )}
            </button>

            {/* Step back / forward */}
            <button
              onClick={() => setCurrentDay((d) => Math.max(1, d - 1))}
              disabled={playing || currentDay <= 1}
              className="rounded-xl border border-[#1f2937] bg-[#0a0e17] p-2.5 text-text-secondary transition hover:text-text-primary disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDay((d) => Math.min(data.length, d + 1))}
              disabled={playing || currentDay >= data.length}
              className="rounded-xl border border-[#1f2937] bg-[#0a0e17] p-2.5 text-text-secondary transition hover:text-text-primary disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day progress */}
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>Day {currentDay} of {data.length}</span>
            <div className="flex gap-1">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { stopPlayback(); setCurrentDay(i + 1); }}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i < currentDay
                      ? data[i].locked
                        ? "w-4 bg-amber-accent"
                        : "w-4 bg-green-accent"
                      : "w-2 bg-[#1f2937]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Current day annotation */}
        {currentPoint?.annotation && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
              currentPoint.locked
                ? "border-amber-accent/20 bg-amber-accent/5 text-amber-accent"
                : "border-green-accent/20 bg-green-accent/5 text-green-accent"
            }`}
          >
            <span className="mr-2">{currentPoint.locked ? "🔒" : "📈"}</span>
            Day {currentDay}: {currentPoint.annotation}
            {currentPoint.locked && currentDay === 6 && (
              <span className="ml-2 text-text-secondary">
                — Balance exceeded ${(cfg.lockThreshold).toLocaleString()}, floor is now permanent
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend / explainer */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            color: "bg-green-accent",
            label: "Account Balance",
            desc: "Your running balance. Goes up on wins, down on losses.",
          },
          {
            color: "bg-red-accent",
            label: "Drawdown Floor",
            desc: "The minimum your balance can reach. Trails your highest EOD balance.",
          },
          {
            color: "bg-amber-accent",
            label: "Floor Locked",
            desc: `Once balance clears $${cfg.lockThreshold.toLocaleString()}, the floor stops trailing and locks permanently.`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex gap-3 rounded-xl border border-[#1f2937] bg-[#111827] p-4"
          >
            <div className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${item.color}`} />
            <div>
              <div className="text-sm font-medium text-text-primary">{item.label}</div>
              <div className="mt-0.5 text-xs text-text-secondary">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total P&L summary */}
      <div className="mt-3 rounded-xl border border-[#1f2937] bg-[#111827] px-5 py-3 text-sm">
        <span className="text-text-secondary">Total P&amp;L after Day {currentDay}: </span>
        <span className={`font-bold ${totalPnl >= 0 ? "text-green-accent" : "text-red-accent"}`}>
          {totalPnl >= 0 ? "+" : ""}${Math.abs(totalPnl).toLocaleString()}
        </span>
        {currentPoint?.locked && (
          <span className="ml-3 text-amber-accent">
            Drawdown floor locked at ${currentPoint.drawdownFloor.toLocaleString()}
          </span>
        )}
      </div>
    </section>
  );
}

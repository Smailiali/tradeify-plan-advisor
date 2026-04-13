"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ROIInputs, ROIResult, AccountSize } from "@/types/plans";
import { planData } from "@/data/plans";

const ROIChart = dynamic(() => import("./ROIChart"), { ssr: false });

// ── Calculation logic ────────────────────────────────────────────────────────

function calcROI(inputs: ROIInputs, accountSize: AccountSize): ROIResult[] {
  const { avgDailyProfit, tradingDaysPerWeek, winRate, avgLossPerLosingDay } =
    inputs;

  const weeklyGross = avgDailyProfit * winRate * tradingDaysPerWeek;
  const weeklyLoss = avgLossPerLosingDay * (1 - winRate) * tradingDaysPerWeek;
  const weeklyNetProfit = weeklyGross - weeklyLoss;
  const monthlyNetProfit = weeklyNetProfit * 4.3;

  return planData[accountSize].map((plan) => {
    const monthlyAfterSplit = monthlyNetProfit * (plan.profitSplit / 100);
    const weeklyAfterSplit = weeklyNetProfit * (plan.profitSplit / 100);
    const breakevenWeeks =
      weeklyAfterSplit > 0 ? plan.price / weeklyAfterSplit : Infinity;
    const threeMonthEarnings = monthlyAfterSplit * 3 - plan.price;
    const totalROIPercent =
      plan.price > 0 ? (threeMonthEarnings / plan.price) * 100 : 0;

    return {
      plan,
      weeklyNetProfit,
      monthlyNetProfit,
      breakevenWeeks,
      threeMonthEarnings,
      totalROIPercent,
    };
  });
}

// ── Slider input ─────────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  accent?: string;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  accent = "#3b82f6",
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="rounded-lg border border-[#1f2937] bg-[#0a0e17] px-3 py-1 text-sm font-semibold text-text-primary">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-xs text-text-secondary/50">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── Days selector ─────────────────────────────────────────────────────────────

function DaysSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">
        Trading Days / Week
      </label>
      <div className="flex gap-2">
        {[3, 4, 5].map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-150 ${
              value === d
                ? "border-blue-accent bg-blue-accent text-white"
                : "border-[#1f2937] bg-[#0a0e17] text-text-secondary hover:text-text-primary"
            }`}
          >
            {d} days
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────

const ACCENT_MAP = {
  green: {
    border: "border-green-accent/30",
    text: "text-green-accent",
    badge: "bg-green-accent/10 text-green-accent border-green-accent/20",
    bg: "bg-green-accent/5",
  },
  blue: {
    border: "border-blue-accent/30",
    text: "text-blue-accent",
    badge: "bg-blue-accent/10 text-blue-accent border-blue-accent/20",
    bg: "bg-blue-accent/5",
  },
  amber: {
    border: "border-amber-accent/30",
    text: "text-amber-accent",
    badge: "bg-amber-accent/10 text-amber-accent border-amber-accent/20",
    bg: "bg-amber-accent/5",
  },
} as const;

function ResultCard({
  result,
  isBestValue,
}: {
  result: ROIResult;
  isBestValue: boolean;
}) {
  const a = ACCENT_MAP[result.plan.accentColor];
  const bw = result.breakevenWeeks;
  const breakevenLabel =
    bw === Infinity
      ? "Never (unprofitable)"
      : bw < 1
      ? "< 1 week"
      : `${bw.toFixed(1)} weeks`;

  const earn3m = result.threeMonthEarnings;
  const roi = result.totalROIPercent;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-[#111827] p-5 transition-shadow ${a.border} ${isBestValue ? `shadow-lg ${a.bg}` : ""}`}
    >
      {/* Top accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          result.plan.accentColor === "green"
            ? "bg-green-accent"
            : result.plan.accentColor === "blue"
            ? "bg-blue-accent"
            : "bg-amber-accent"
        }`}
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className={`text-lg font-bold ${a.text}`}>{result.plan.name}</span>
        {isBestValue && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}
          >
            Fastest Breakeven
          </span>
        )}
      </div>

      {/* Plan cost */}
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-text-primary">
          ${result.plan.price}
        </span>
        <span className="text-sm text-text-secondary">plan cost</span>
      </div>

      {/* Stats grid */}
      <dl className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <dt className="text-text-secondary">Breakeven</dt>
          <dd
            className={`font-semibold ${
              bw === Infinity ? "text-red-accent" : "text-text-primary"
            }`}
          >
            {breakevenLabel}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-text-secondary">3-Month Net</dt>
          <dd
            className={`font-semibold ${earn3m >= 0 ? "text-green-accent" : "text-red-accent"}`}
          >
            {earn3m >= 0 ? "+" : ""}
            {earn3m.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-text-secondary">3-Month ROI</dt>
          <dd
            className={`font-semibold ${roi >= 0 ? "text-green-accent" : "text-red-accent"}`}
          >
            {roi >= 0 ? "+" : ""}
            {roi.toFixed(0)}%
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-text-secondary">Profit Split</dt>
          <dd className="font-semibold text-text-primary">
            {result.plan.profitSplit}% to you
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const DEFAULT_INPUTS: ROIInputs = {
  avgDailyProfit: 200,
  tradingDaysPerWeek: 4,
  winRate: 0.6,
  avgLossPerLosingDay: 150,
};

export default function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_INPUTS);
  const [accountSize, setAccountSize] = useState<AccountSize>("50k");

  const results = useMemo(
    () => calcROI(inputs, accountSize),
    [inputs, accountSize]
  );

  const weeklyNet = useMemo(() => {
    const { avgDailyProfit, tradingDaysPerWeek, winRate, avgLossPerLosingDay } =
      inputs;
    return (
      avgDailyProfit * winRate * tradingDaysPerWeek -
      avgLossPerLosingDay * (1 - winRate) * tradingDaysPerWeek
    );
  }, [inputs]);

  const monthlyNet = weeklyNet * 4.3;

  const bestValueIndex = useMemo(() => {
    const finite = results.filter((r) => r.breakevenWeeks !== Infinity);
    if (!finite.length) return -1;
    const min = Math.min(...finite.map((r) => r.breakevenWeeks));
    return results.findIndex((r) => r.breakevenWeeks === min);
  }, [results]);

  const set = (key: keyof ROIInputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  const SIZE_LABELS: Record<AccountSize, string> = {
    "25k": "$25K",
    "50k": "$50K",
    "100k": "$100K",
    "150k": "$150K",
  };

  return (
    <section id="roi" className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
          ROI &amp; Breakeven Calculator
        </h2>
        <p className="mt-1 text-text-secondary">
          Enter your expected performance and see which plan pays for itself fastest.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left: inputs */}
        <div className="space-y-6 rounded-2xl border border-[#1f2937] bg-[#111827] p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Your Trading Profile
          </h3>

          <SliderInput
            label="Average Daily Profit (on winning days)"
            value={inputs.avgDailyProfit}
            min={50}
            max={1000}
            step={25}
            format={(v) => `$${v}`}
            onChange={set("avgDailyProfit")}
            accent="#10b981"
          />

          <DaysSelector
            value={inputs.tradingDaysPerWeek}
            onChange={set("tradingDaysPerWeek")}
          />

          <SliderInput
            label="Win Rate"
            value={inputs.winRate}
            min={0.4}
            max={0.8}
            step={0.01}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={set("winRate")}
            accent="#3b82f6"
          />

          <SliderInput
            label="Average Loss per Losing Day"
            value={inputs.avgLossPerLosingDay}
            min={50}
            max={500}
            step={25}
            format={(v) => `$${v}`}
            onChange={set("avgLossPerLosingDay")}
            accent="#ef4444"
          />

          {/* Summary row */}
          <div className="grid grid-cols-2 gap-3 border-t border-[#1f2937] pt-5">
            <div className="rounded-xl bg-[#0a0e17] px-4 py-3">
              <div className="text-xs text-text-secondary">Est. Weekly Net</div>
              <div
                className={`mt-0.5 text-lg font-bold ${weeklyNet >= 0 ? "text-green-accent" : "text-red-accent"}`}
              >
                {weeklyNet >= 0 ? "+" : ""}$
                {Math.abs(weeklyNet).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div className="rounded-xl bg-[#0a0e17] px-4 py-3">
              <div className="text-xs text-text-secondary">Est. Monthly Net</div>
              <div
                className={`mt-0.5 text-lg font-bold ${monthlyNet >= 0 ? "text-green-accent" : "text-red-accent"}`}
              >
                {monthlyNet >= 0 ? "+" : ""}$
                {Math.abs(monthlyNet).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: account size picker + note */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Account Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SIZE_LABELS) as AccountSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setAccountSize(s)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all duration-150 ${
                    accountSize === s
                      ? "border-blue-accent bg-blue-accent text-white"
                      : "border-[#1f2937] bg-[#0a0e17] text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {SIZE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-5 text-sm text-text-secondary leading-relaxed">
            <p className="mb-1 font-medium text-text-primary">How this works</p>
            Weekly net = (profit x win rate x days) minus (loss x lose rate x days).
            Breakeven = plan cost divided by weekly net after the 90/10 profit split.
            3-month projection starts from week 1.
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-2xl border border-[#1f2937] bg-[#111827] p-6">
        <h3 className="mb-1 text-base font-semibold text-text-primary">
          12-Week Cumulative Earnings
        </h3>
        <p className="mb-6 text-sm text-text-secondary">
          Starting from -plan cost at week 0. Crossing $0 = breakeven.
        </p>
        <ROIChart results={results} weeklyNetProfit={weeklyNet} />
      </div>

      {/* Result cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {results.map((r, i) => (
          <ResultCard key={r.plan.name} result={r} isBestValue={i === bestValueIndex} />
        ))}
      </div>
    </section>
  );
}

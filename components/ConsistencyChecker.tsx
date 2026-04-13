"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ConsistencyDay } from "@/types/plans";
import { defaultConsistencyDays } from "@/data/plans";

const ConsistencyChart = dynamic(() => import("./ConsistencyChart"), {
  ssr: false,
});

// ── Calculation ───────────────────────────────────────────────────────────────

interface DayResult extends ConsistencyDay {
  percentage: number;
  violates: boolean;
}

interface CalcResult {
  days: DayResult[];
  totalProfit: number;
  passes: boolean;
  worstViolation: DayResult | null;
  requiredTotal: number | null;
}

function calcConsistency(days: ConsistencyDay[], threshold: number): CalcResult {
  const positiveDays = days.filter((d) => d.pnl > 0);
  const totalProfit = positiveDays.reduce((sum, d) => sum + d.pnl, 0);

  const enriched: DayResult[] = days.map((d) => {
    const percentage = totalProfit > 0 && d.pnl > 0 ? (d.pnl / totalProfit) * 100 : 0;
    return {
      ...d,
      percentage,
      violates: percentage > threshold,
    };
  });

  const violations = enriched.filter((d) => d.violates);
  const worstViolation =
    violations.length > 0
      ? violations.reduce((a, b) => (a.percentage > b.percentage ? a : b))
      : null;

  const requiredTotal = worstViolation
    ? Math.ceil((worstViolation.pnl * 100) / threshold)
    : null;

  return {
    days: enriched,
    totalProfit,
    passes: violations.length === 0,
    worstViolation,
    requiredTotal,
  };
}

// ── P&L input row ─────────────────────────────────────────────────────────────

function PnlRow({
  day,
  pnl,
  result,
  threshold,
  onChange,
  onRemove,
  canRemove,
}: {
  day: number;
  pnl: number;
  result: DayResult;
  threshold: number;
  onChange: (v: number) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <tr
      className={`border-b border-[#1f2937] transition-colors ${
        result.violates ? "bg-red-accent/5" : ""
      }`}
    >
      <td className="py-2.5 pl-4 text-sm font-medium text-text-secondary">
        Day {day}
      </td>
      <td className="px-3 py-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
            $
          </span>
          <input
            type="number"
            value={pnl}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full rounded-lg border bg-[#0a0e17] py-1.5 pl-6 pr-3 text-sm text-text-primary outline-none transition focus:ring-1 ${
              result.violates
                ? "border-red-accent/50 focus:ring-red-accent/30"
                : "border-[#1f2937] focus:ring-blue-accent/30"
            }`}
          />
        </div>
      </td>
      <td className="px-3 py-2 text-center">
        <span
          className={`text-sm font-semibold ${
            result.violates ? "text-red-accent" : "text-green-accent"
          }`}
        >
          {result.percentage.toFixed(1)}%
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        {result.violates ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-accent/10 px-2.5 py-0.5 text-xs font-medium text-red-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-red-accent" />
            Fail
          </span>
        ) : result.pnl > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-accent/10 px-2.5 py-0.5 text-xs font-medium text-green-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-green-accent" />
            Pass
          </span>
        ) : (
          <span className="text-xs text-text-secondary">Loss day</span>
        )}
      </td>
      <td className="py-2 pr-3 text-right">
        {canRemove && (
          <button
            onClick={onRemove}
            className="rounded-lg p-1 text-text-secondary/40 transition hover:text-red-accent"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const THRESHOLD_OPTIONS = [20, 25, 30, 35, 40];

export default function ConsistencyChecker() {
  const [days, setDays] = useState<ConsistencyDay[]>(defaultConsistencyDays);
  const [threshold, setThreshold] = useState(35);

  const result = useMemo(() => calcConsistency(days, threshold), [days, threshold]);

  const updatePnl = (index: number, value: number) => {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, pnl: value } : d))
    );
  };

  const removeDay = (index: number) => {
    setDays((prev) => prev.filter((_, i) => i !== index));
  };

  const addDay = () => {
    const nextDay = days.length > 0 ? Math.max(...days.map((d) => d.day)) + 1 : 1;
    setDays((prev) => [...prev, { day: nextDay, pnl: 0 }]);
  };

  const resetDays = () => {
    setDays(defaultConsistencyDays);
    setThreshold(35);
  };

  return (
    <section id="consistency" className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
          Consistency Rule Checker
        </h2>
        <p className="mt-1 text-text-secondary">
          Enter your daily P&amp;L and see if you would pass the consistency rule before requesting a payout.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: table + controls */}
        <div className="space-y-4">
          {/* Threshold selector */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#1f2937] bg-[#111827] px-5 py-4">
            <span className="text-sm font-medium text-text-secondary">
              Consistency Rule:
            </span>
            <div className="flex gap-2">
              {THRESHOLD_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setThreshold(t)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150 ${
                    threshold === t
                      ? "bg-blue-accent text-white"
                      : "border border-[#1f2937] bg-[#0a0e17] text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-text-secondary/60">
              No single day can exceed {threshold}% of total profit
            </span>
          </div>

          {/* P&L table */}
          <div className="overflow-hidden rounded-2xl border border-[#1f2937] bg-[#111827]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937] bg-[#0d1117]">
                  <th className="py-3 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Day
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    P&amp;L
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    % of Total
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status
                  </th>
                  <th className="py-3 pr-3" />
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => (
                  <PnlRow
                    key={d.day}
                    day={d.day}
                    pnl={d.pnl}
                    result={result.days[i]}
                    threshold={threshold}
                    onChange={(v) => updatePnl(i, v)}
                    onRemove={() => removeDay(i)}
                    canRemove={days.length > 2}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#1f2937] bg-[#0d1117]">
                  <td className="py-3 pl-4 text-sm font-semibold text-text-secondary">
                    Total
                  </td>
                  <td className="px-3 py-3 text-sm font-bold text-text-primary">
                    ${result.totalProfit.toLocaleString()}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>

            {/* Add/reset row */}
            <div className="flex items-center gap-3 border-t border-[#1f2937] px-4 py-3">
              {days.length < 10 && (
                <button
                  onClick={addDay}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f2937] bg-[#0a0e17] px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Day
                </button>
              )}
              <button
                onClick={resetDays}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f2937] bg-[#0a0e17] px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right: result panel */}
        <div className="space-y-4">
          {/* Pass / Fail badge */}
          <div
            className={`rounded-2xl border p-6 text-center ${
              result.passes
                ? "border-green-accent/30 bg-green-accent/5"
                : "border-red-accent/30 bg-red-accent/5"
            }`}
          >
            <div
              className={`mb-2 text-4xl font-black tracking-tight ${
                result.passes ? "text-green-accent" : "text-red-accent"
              }`}
            >
              {result.passes ? "PASS" : "FAIL"}
            </div>
            <div className="text-sm text-text-secondary">
              {result.passes
                ? "Your trading meets the consistency requirement."
                : `${result.days.filter((d) => d.violates).length} day${result.days.filter((d) => d.violates).length > 1 ? "s" : ""} exceed the ${threshold}% threshold.`}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3">
              <div className="text-xs text-text-secondary">Total Profit</div>
              <div className="mt-0.5 font-bold text-text-primary">
                ${result.totalProfit.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3">
              <div className="text-xs text-text-secondary">Best Single Day</div>
              <div className="mt-0.5 font-bold text-text-primary">
                {result.days.length > 0
                  ? `${Math.max(...result.days.map((d) => d.percentage)).toFixed(1)}%`
                  : "0%"}
              </div>
            </div>
          </div>

          {/* Suggestion card */}
          {result.worstViolation && result.requiredTotal && (
            <div className="rounded-2xl border border-amber-accent/20 bg-amber-accent/5 p-4 text-sm">
              <div className="mb-1.5 flex items-center gap-2 font-semibold text-amber-accent">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                How to Pass
              </div>
              <p className="text-text-secondary leading-relaxed">
                Your Day {result.worstViolation.day} profit of{" "}
                <span className="font-semibold text-text-primary">
                  ${result.worstViolation.pnl.toLocaleString()}
                </span>{" "}
                is{" "}
                <span className="font-semibold text-red-accent">
                  {result.worstViolation.percentage.toFixed(1)}%
                </span>{" "}
                of your total. To pass the {threshold}% rule, you would need at least{" "}
                <span className="font-semibold text-green-accent">
                  ${result.requiredTotal.toLocaleString()}
                </span>{" "}
                in total profits before requesting a payout.
              </p>
            </div>
          )}

          {/* Chart */}
          <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Daily % of Total Profit
            </div>
            <ConsistencyChart days={result.days} threshold={threshold} />
            <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-green-accent" /> Passing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-red-accent" /> Violating
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-red-accent opacity-60" style={{ borderTop: "2px dashed #ef4444", background: "none" }} />
                {threshold}% limit
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

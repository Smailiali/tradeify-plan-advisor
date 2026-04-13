"use client";

import { useState } from "react";
import type { AccountSize, Plan } from "@/types/plans";
import { planData } from "@/data/plans";
import AccountSizeToggle from "./AccountSizeToggle";

// ── accent helpers ──────────────────────────────────────────────────────────

const ACCENT = {
  green: {
    bar: "bg-green-accent",
    text: "text-green-accent",
    badge: "bg-green-accent/10 text-green-accent border-green-accent/20",
    border: "border-green-accent/30",
    glow: "shadow-green-accent/10",
  },
  blue: {
    bar: "bg-blue-accent",
    text: "text-blue-accent",
    badge: "bg-blue-accent/10 text-blue-accent border-blue-accent/20",
    border: "border-blue-accent/30",
    glow: "shadow-blue-accent/10",
  },
  amber: {
    bar: "bg-amber-accent",
    text: "text-amber-accent",
    badge: "bg-amber-accent/10 text-amber-accent border-amber-accent/20",
    border: "border-amber-accent/30",
    glow: "shadow-amber-accent/10",
  },
} as const;

// ── row definitions ─────────────────────────────────────────────────────────

type RowKey =
  | "price"
  | "evaluation"
  | "minDays"
  | "profitTarget"
  | "maxDrawdown"
  | "dailyLossLimit"
  | "consistencyEval"
  | "consistencyFunded"
  | "payoutPolicy"
  | "profitSplit"
  | "bestFor";

interface Row {
  key: RowKey;
  label: string;
  render: (plan: Plan) => React.ReactNode;
  /** Return true for the plan(s) that have the "best" value for this row */
  isBest?: (plan: Plan, all: Plan[]) => boolean;
}

const fmt = (n: number) =>
  "$" + n.toLocaleString();

const ROWS: Row[] = [
  {
    key: "price",
    label: "Price",
    render: (p) => (
      <span className="text-lg font-bold text-text-primary">{fmt(p.price)}</span>
    ),
    isBest: (p, all) => p.price === Math.min(...all.map((x) => x.price)),
  },
  {
    key: "evaluation",
    label: "Evaluation Required",
    render: (p) =>
      p.evaluationRequired ? (
        <span className="text-amber-accent">Yes</span>
      ) : (
        <span className="text-green-accent font-medium">No — Instant Funding</span>
      ),
    isBest: (p) => !p.evaluationRequired,
  },
  {
    key: "minDays",
    label: "Min Days to Pass",
    render: (p) =>
      p.minDaysToPass === null ? (
        <span className="text-green-accent font-medium">Instant</span>
      ) : (
        <span className="text-text-primary">{p.minDaysToPass} day{p.minDaysToPass > 1 ? "s" : ""}</span>
      ),
    isBest: (p, all) => {
      const min = Math.min(...all.map((x) => x.minDaysToPass ?? 0));
      return (p.minDaysToPass ?? 0) === min;
    },
  },
  {
    key: "profitTarget",
    label: "Profit Target",
    render: (p) =>
      p.profitTarget === null ? (
        <span className="text-green-accent font-medium">None</span>
      ) : (
        <span className="text-text-primary">{fmt(p.profitTarget)}</span>
      ),
    isBest: (p) => p.profitTarget === null,
  },
  {
    key: "maxDrawdown",
    label: "Max Drawdown",
    render: (p) => <span className="text-text-primary">{fmt(p.maxDrawdown)}</span>,
    isBest: (p, all) => p.maxDrawdown === Math.max(...all.map((x) => x.maxDrawdown)),
  },
  {
    key: "dailyLossLimit",
    label: "Daily Loss Limit",
    render: (p) =>
      p.dailyLossLimit === null ? (
        <span className="text-green-accent font-medium">None (eval)</span>
      ) : (
        <span className="text-text-primary">{fmt(p.dailyLossLimit)}</span>
      ),
    isBest: (p) => p.dailyLossLimit === null,
  },
  {
    key: "consistencyEval",
    label: "Consistency Rule (Eval)",
    render: (p) =>
      p.consistencyRuleEval === null ? (
        <span className="text-green-accent font-medium">None</span>
      ) : (
        <span className="text-text-primary">{p.consistencyRuleEval}%</span>
      ),
    isBest: (p) => p.consistencyRuleEval === null,
  },
  {
    key: "consistencyFunded",
    label: "Consistency Rule (Funded)",
    render: (p) => {
      if (p.progressiveConsistency && p.progressiveSteps) {
        return (
          <span className="text-text-primary">
            {p.progressiveSteps.join("% / ")}% progressive
          </span>
        );
      }
      if (p.consistencyRuleFunded === null) {
        return <span className="text-green-accent font-medium">None</span>;
      }
      return <span className="text-text-primary">{p.consistencyRuleFunded}%</span>;
    },
    isBest: (p) => !p.progressiveConsistency && p.consistencyRuleFunded === null,
  },
  {
    key: "payoutPolicy",
    label: "Payout Policy",
    render: (p) => {
      const opts = p.payoutOptions.filter(Boolean);
      if (opts.length === 0) return <span className="text-text-secondary">Standard</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {opts.map((o) => (
            <span
              key={o}
              className="rounded-md border border-blue-accent/20 bg-blue-accent/10 px-2 py-0.5 text-xs text-blue-accent"
            >
              {o}
            </span>
          ))}
        </div>
      );
    },
    isBest: (p) => p.payoutOptions.filter(Boolean).length > 1,
  },
  {
    key: "profitSplit",
    label: "Profit Split",
    render: (p) => (
      <span className="font-medium text-green-accent">{p.profitSplit}% to trader</span>
    ),
  },
  {
    key: "bestFor",
    label: "Best For",
    render: (p) => (
      <span className="text-sm text-text-secondary">{p.bestFor}</span>
    ),
  },
];

// ── Best badge ───────────────────────────────────────────────────────────────

function BestBadge({ color }: { color: keyof typeof ACCENT }) {
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ACCENT[color].badge}`}
    >
      Best
    </span>
  );
}

// ── Desktop table ────────────────────────────────────────────────────────────

function DesktopTable({ plans }: { plans: Plan[] }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[#1f2937] md:block">
      {/* Plan header row */}
      <div className="grid grid-cols-4 bg-[#0d1117]">
        <div className="border-b border-r border-[#1f2937] px-5 py-4 text-sm font-medium text-text-secondary">
          Feature
        </div>
        {plans.map((plan) => {
          const a = ACCENT[plan.accentColor];
          return (
            <div
              key={plan.name}
              className="relative border-b border-r border-[#1f2937] last:border-r-0"
            >
              {/* Colored top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-0.5 ${a.bar}`} />
              <div className="px-5 py-4 pt-5 text-center">
                <span className={`text-lg font-bold ${a.text}`}>{plan.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data rows */}
      {ROWS.map((row, i) => (
        <div
          key={row.key}
          className={`grid grid-cols-4 ${
            i % 2 === 0 ? "bg-[#111827]" : "bg-[#0d1117]"
          }`}
        >
          <div className="border-r border-[#1f2937] px-5 py-3.5 text-sm font-medium text-text-secondary">
            {row.label}
          </div>
          {plans.map((plan) => {
            const best = row.isBest?.(plan, plans) ?? false;
            return (
              <div
                key={plan.name}
                className={`border-r border-[#1f2937] px-5 py-3.5 text-sm last:border-r-0 ${
                  best ? "bg-[#ffffff03]" : ""
                }`}
              >
                <div className="flex items-center">
                  {row.render(plan)}
                  {best && <BestBadge color={plan.accentColor} />}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Mobile cards ─────────────────────────────────────────────────────────────

function MobileCards({ plans }: { plans: Plan[] }) {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {plans.map((plan) => {
        const a = ACCENT[plan.accentColor];
        return (
          <div
            key={plan.name}
            className={`overflow-hidden rounded-2xl border bg-[#111827] shadow-lg ${a.border} ${a.glow}`}
          >
            {/* Colored top bar */}
            <div className={`h-1 w-full ${a.bar}`} />
            <div className="px-5 py-4">
              <h3 className={`mb-4 text-xl font-bold ${a.text}`}>{plan.name}</h3>
              <dl className="space-y-3">
                {ROWS.map((row) => {
                  const best = row.isBest?.(plan, plans) ?? false;
                  return (
                    <div key={row.key} className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-sm text-text-secondary">{row.label}</dt>
                      <dd className="text-right text-sm">
                        <span className="flex items-center justify-end gap-1">
                          {row.render(plan)}
                          {best && <BestBadge color={plan.accentColor} />}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function PlanComparison() {
  const [size, setSize] = useState<AccountSize>("50k");
  const plans = planData[size];

  return (
    <section id="comparison" className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
            Plan Comparison
          </h2>
          <p className="mt-1 text-text-secondary">
            Side-by-side breakdown of every rule that matters.
          </p>
        </div>
        <AccountSizeToggle selected={size} onChange={setSize} />
      </div>

      <DesktopTable plans={plans} />
      <MobileCards plans={plans} />

      {/* Footer note */}
      <p className="mt-4 text-center text-xs text-text-secondary/50">
        All data based on publicly available Tradeify plan information. Verify current pricing at tradeify.com.
      </p>
    </section>
  );
}

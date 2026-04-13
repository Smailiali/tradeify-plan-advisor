"use client";

import type { Recommendation } from "@/types/plans";

interface Props {
  recommendation: Recommendation;
  onReset: () => void;
}

const PLAN_ACCENT = {
  Growth: {
    text: "text-green-accent",
    badge: "bg-green-accent/10 text-green-accent border-green-accent/30",
    bar: "bg-green-accent",
    glow: "shadow-green-accent/10",
  },
  Select: {
    text: "text-blue-accent",
    badge: "bg-blue-accent/10 text-blue-accent border-blue-accent/30",
    bar: "bg-blue-accent",
    glow: "shadow-blue-accent/10",
  },
  Lightning: {
    text: "text-amber-accent",
    badge: "bg-amber-accent/10 text-amber-accent border-amber-accent/30",
    bar: "bg-amber-accent",
    glow: "shadow-amber-accent/10",
  },
} as const;

export default function RecommendationResult({ recommendation, onReset }: Props) {
  const planKey = recommendation.recommendedPlan as keyof typeof PLAN_ACCENT;
  const accent = PLAN_ACCENT[planKey] ?? PLAN_ACCENT.Select;

  return (
    <div className="space-y-5">
      {/* Plan name hero */}
      <div className={`relative overflow-hidden rounded-2xl border border-purple-accent/20 bg-[#0d0a1a] p-6 shadow-xl ${accent.glow}`}>
        <div className={`absolute inset-x-0 top-0 h-0.5 ${accent.bar}`} />

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple-accent">
              Recommended Plan
            </p>
            <h3 className={`text-4xl font-black tracking-tight ${accent.text}`}>
              {recommendation.recommendedPlan}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${accent.badge}`}>
              {recommendation.accountSize} Account
            </span>
            {recommendation.payoutPath && (
              <span className="rounded-full border border-purple-accent/30 bg-purple-accent/10 px-4 py-1.5 text-sm font-semibold text-purple-accent">
                {recommendation.payoutPath} Payouts
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-5">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <svg className="h-4 w-4 text-purple-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Why This Plan
        </h4>
        <p className="text-sm leading-relaxed text-text-secondary">
          {recommendation.reasoning}
        </p>
      </div>

      {/* Warnings */}
      {recommendation.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-amber-accent">Things to Watch</h4>
          {recommendation.warnings.map((warning, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-amber-accent/20 bg-amber-accent/5 px-4 py-3"
            >
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-text-secondary">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {/* Next steps */}
      {recommendation.nextSteps.length > 0 && (
        <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-5">
          <h4 className="mb-3 text-sm font-semibold text-text-primary">Next Steps</h4>
          <ol className="space-y-2.5">
            {recommendation.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-accent/20 text-xs font-bold text-purple-accent">
                  {i + 1}
                </span>
                <span className="text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border border-[#1f2937] bg-[#0a0e17] px-5 py-3 text-sm font-medium text-text-secondary transition hover:text-text-primary"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Start Over
      </button>
    </div>
  );
}

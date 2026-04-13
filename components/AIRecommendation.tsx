"use client";

import { useState } from "react";
import type { TraderProfile, Recommendation } from "@/types/plans";
import QuestionnaireForm from "./QuestionnaireForm";
import RecommendationResult from "./RecommendationResult";

type State =
  | { phase: "form" }
  | { phase: "loading" }
  | { phase: "result"; recommendation: Recommendation }
  | { phase: "error"; message: string };

export default function AIRecommendation() {
  const [state, setState] = useState<State>({ phase: "form" });

  const handleSubmit = async (profile: TraderProfile) => {
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      const data = await res.json() as { recommendation?: Recommendation; error?: string };

      if (!res.ok || !data.recommendation) {
        throw new Error(data.error ?? "Failed to get recommendation");
      }

      setState({ phase: "result", recommendation: data.recommendation });
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const handleReset = () => setState({ phase: "form" });

  return (
    <section id="ai" className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-accent/20 bg-purple-accent/10 px-4 py-1.5 text-sm font-medium text-purple-accent">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          Powered by Claude AI
        </div>

        <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
          AI Plan Advisor
        </h2>
        <p className="mt-1 text-text-secondary">
          Answer 7 quick questions and get a personalized plan recommendation tailored to your trading style.
        </p>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-purple-accent/20 bg-[#0d0a1a] p-6 md:p-8">
        {state.phase === "form" && (
          <QuestionnaireForm
            onSubmit={handleSubmit}
            loading={false}
          />
        )}

        {state.phase === "loading" && (
          <QuestionnaireForm
            onSubmit={handleSubmit}
            loading={true}
          />
        )}

        {state.phase === "result" && (
          <RecommendationResult
            recommendation={state.recommendation}
            onReset={handleReset}
          />
        )}

        {state.phase === "error" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-accent/10">
              <svg className="h-6 w-6 text-red-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Something went wrong</p>
              <p className="mt-1 text-sm text-text-secondary">{state.message}</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-text-secondary/50">
        AI recommendations are for informational purposes only. Always review the official Tradeify terms before purchasing.
      </p>
    </section>
  );
}

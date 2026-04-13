"use client";

import { useCallback } from "react";

export default function Hero() {
  const scrollToAI = useCallback(() => {
    const el = document.getElementById("ai");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a0e17] to-[#111827] pb-24 pt-32 md:pb-32 md:pt-40"
    >
      {/* Animated dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Gradient mesh overlays */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-accent opacity-5 blur-3xl" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-purple-accent opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-green-accent opacity-5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-accent/20 bg-blue-accent/10 px-4 py-1.5 text-sm text-blue-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-accent animate-pulse" />
          AI-Powered Plan Advisor
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl lg:text-7xl">
          Tradeify{" "}
          <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-green-accent bg-clip-text text-transparent">
            Plan Advisor
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
          Find the right funded account for your trading style. Compare plans,
          calculate ROI, visualize drawdowns, and get a personalized
          recommendation powered by Claude AI.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={scrollToAI}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-blue-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-accent/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-accent/40 active:scale-95"
          >
            <span>Get My Recommendation</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("comparison");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[#1f2937] bg-[#111827]/60 px-8 py-4 text-base font-semibold text-text-secondary backdrop-blur-sm transition-all duration-200 hover:border-[#374151] hover:text-text-primary"
          >
            Compare Plans
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-[#1f2937] pt-10 md:grid-cols-3">
          {[
            { label: "Account Sizes", value: "4", sub: "$25K to $150K" },
            { label: "Plans Compared", value: "3", sub: "Growth, Select, Lightning" },
            { label: "AI-Powered", value: "100%", sub: "Personalized recommendation" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-text-primary md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-0.5 text-xs font-medium uppercase tracking-wider text-text-secondary">
                {stat.label}
              </div>
              <div className="mt-1 hidden text-xs text-text-secondary/60 md:block">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-xs text-text-secondary/50">
          Independent project. Not affiliated with or endorsed by Tradeify.
          Plan data based on publicly available information.
        </p>
      </div>
    </section>
  );
}

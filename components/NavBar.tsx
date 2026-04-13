"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "comparison", label: "Compare" },
  { id: "roi", label: "ROI" },
  { id: "drawdown", label: "Drawdown" },
  { id: "consistency", label: "Consistency" },
  { id: "ai", label: "AI Advisor" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

      // Highlight active section based on scroll position
      const current = SECTIONS.slice()
        .reverse()
        .find((s) => {
          const el = document.getElementById(s.id);
          if (!el) return false;
          return window.scrollY >= el.offsetTop - 120;
        });
      setActive(current?.id ?? "");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#1f2937] bg-[#0a0e17]/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-sm font-bold text-text-primary transition hover:text-blue-accent"
        >
          Tradeify{" "}
          <span className="font-normal text-text-secondary">Plan Advisor</span>
        </button>

        {/* Section links — hidden on mobile */}
        <div className="hidden items-center gap-1 sm:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                active === s.id
                  ? "bg-blue-accent/10 text-blue-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo("ai")}
          className="rounded-lg bg-blue-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500 active:scale-95"
        >
          Get Recommendation
        </button>
      </div>
    </nav>
  );
}

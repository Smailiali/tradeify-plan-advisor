"use client";

import type { TraderProfile, AccountSize } from "@/types/plans";

interface Props {
  onSubmit: (profile: TraderProfile) => void;
  loading: boolean;
}

type ProfileKey = keyof TraderProfile;

interface Option {
  value: string;
  label: string;
  sub?: string;
}

interface Question {
  key: ProfileKey;
  question: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: "experience",
    question: "How long have you been trading futures?",
    options: [
      { value: "lt6months", label: "Less than 6 months", sub: "Still learning the ropes" },
      { value: "6to12months", label: "6-12 months", sub: "Building consistency" },
      { value: "1to2years", label: "1-2 years", sub: "Comfortable with setups" },
      { value: "2plus", label: "2+ years", sub: "Experienced trader" },
    ],
  },
  {
    key: "style",
    question: "How would you describe your trading style?",
    options: [
      { value: "scalper", label: "Scalper", sub: "Many quick trades, tight stops" },
      { value: "daytrader", label: "Day Trader", sub: "A few high-conviction setups per day" },
      { value: "swing", label: "Swing-ish", sub: "Hold for hours, bigger moves" },
    ],
  },
  {
    key: "riskTolerance",
    question: "How do you handle drawdowns?",
    options: [
      { value: "cutfast", label: "I cut losses fast", sub: "Small stops, move on quickly" },
      { value: "givesroom", label: "I give trades room to breathe", sub: "Wider stops, trust the setup" },
      { value: "inbetween", label: "Somewhere in between", sub: "Depends on the trade" },
    ],
  },
  {
    key: "consistency",
    question: "How consistent are your daily results?",
    options: [
      { value: "veryconsistent", label: "Very consistent", sub: "Similar P&L most days" },
      { value: "moderate", label: "Moderate", sub: "Some bigger days, some smaller" },
      { value: "inconsistent", label: "Inconsistent", sub: "A few big wins carry the month" },
    ],
  },
  {
    key: "speedPriority",
    question: "How quickly do you want to start trading?",
    options: [
      { value: "asap", label: "ASAP", sub: "Skip evaluation, fund me now" },
      { value: "canwait", label: "I can wait a few days", sub: "Fine with a short eval" },
      { value: "patient", label: "I'm patient", sub: "Lowest cost matters most" },
    ],
  },
  {
    key: "capitalGoal",
    question: "What account size interests you?",
    options: [
      { value: "25k", label: "$25K", sub: "Lowest barrier to entry" },
      { value: "50k", label: "$50K", sub: "Most popular choice" },
      { value: "100k", label: "$100K", sub: "More buying power" },
      { value: "150k", label: "$150K", sub: "Maximum account size" },
    ],
  },
  {
    key: "payoutPreference",
    question: "How often do you want to withdraw profits?",
    options: [
      { value: "daily", label: "Daily", sub: "Access profits every day" },
      { value: "every5days", label: "Every 5 days", sub: "Flexible cadence" },
      { value: "flexible", label: "I'm flexible", sub: "Payout timing doesn't matter" },
    ],
  },
];

const EMPTY: Partial<TraderProfile> = {};

function isComplete(profile: Partial<TraderProfile>): profile is TraderProfile {
  return QUESTIONS.every((q) => profile[q.key] !== undefined);
}

export default function QuestionnaireForm({ onSubmit, loading }: Props) {
  const [answers, setAnswers] = useState<Partial<TraderProfile>>(EMPTY);

  const select = (key: ProfileKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value as never }));
  };

  const answeredCount = QUESTIONS.filter((q) => answers[q.key] !== undefined).length;
  const complete = isComplete(answers);

  return (
    <div className="space-y-5">
      {QUESTIONS.map((q, qi) => {
        const answered = answers[q.key] !== undefined;
        return (
          <div key={q.key} className={`rounded-2xl border bg-[#0d0a1a] p-5 transition-all duration-200 ${answered ? "border-purple-accent/30" : "border-[#1f2937]"}`}>
            {/* Question header */}
            <div className="mb-4 flex items-start gap-3">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${answered ? "bg-purple-accent text-white" : "bg-[#1f2937] text-text-secondary"}`}>
                {answered ? (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  qi + 1
                )}
              </span>
              <p className="text-sm font-semibold text-text-primary">{q.question}</p>
            </div>

            {/* Options */}
            <div className={`grid gap-2 ${q.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
              {q.options.map((opt) => {
                const selected = answers[q.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select(q.key, opt.value)}
                    disabled={loading}
                    className={`rounded-xl border p-3 text-left transition-all duration-150 disabled:opacity-50 ${
                      selected
                        ? "border-purple-accent bg-purple-accent/10 shadow-sm shadow-purple-accent/20"
                        : "border-[#1f2937] bg-[#111827]/60 hover:border-[#374151] hover:bg-[#111827]"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${selected ? "text-purple-accent" : "text-text-primary"}`}>
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div className="mt-0.5 text-xs text-text-secondary">{opt.sub}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Progress + Submit */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {QUESTIONS.map((q, i) => (
              <div
                key={i}
                className={`h-1.5 w-5 rounded-full transition-all duration-300 ${
                  answers[q.key] !== undefined ? "bg-purple-accent" : "bg-[#1f2937]"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-secondary">
            {answeredCount} of {QUESTIONS.length} answered
          </span>
        </div>

        <button
          onClick={() => complete && onSubmit(answers)}
          disabled={!complete || loading}
          className={`inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
            complete && !loading
              ? "bg-purple-accent text-white shadow-lg shadow-purple-accent/25 hover:bg-violet-500"
              : "bg-purple-accent/20 text-purple-accent/60"
          }`}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing your profile...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Get My Recommendation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// useState imported at the top of the file scope via React — add the import
import { useState } from "react";

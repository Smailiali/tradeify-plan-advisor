"use client";

import type { AccountSize } from "@/types/plans";

const SIZES: { label: string; value: AccountSize }[] = [
  { label: "$25K", value: "25k" },
  { label: "$50K", value: "50k" },
  { label: "$100K", value: "100k" },
  { label: "$150K", value: "150k" },
];

interface Props {
  selected: AccountSize;
  onChange: (size: AccountSize) => void;
}

export default function AccountSizeToggle({ selected, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-[#1f2937] bg-[#0a0e17] p-1">
      {SIZES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
            selected === s.value
              ? "bg-blue-accent text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

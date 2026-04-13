"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ROIResult } from "@/types/plans";

interface Props {
  results: ROIResult[];
  weeklyNetProfit: number;
}

const COLORS: Record<string, string> = {
  Growth: "#10b981",
  Select: "#3b82f6",
  Lightning: "#f59e0b",
};

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-text-secondary">
        Week {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-text-secondary">{p.name}:</span>
          <span
            className={`font-semibold ${p.value >= 0 ? "text-green-accent" : "text-red-accent"}`}
          >
            {p.value >= 0 ? "+" : ""}
            {p.value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ROIChart({ results, weeklyNetProfit }: Props) {
  // Build 12-week cumulative P&L data starting at -planCost (week 0)
  const weeks = Array.from({ length: 13 }, (_, i) => i);

  const data = weeks.map((week) => {
    const point: Record<string, number> = { week };
    results.forEach((r) => {
      point[r.plan.name] =
        Math.round(week * weeklyNetProfit * 0.9 - r.plan.price);
    });
    return point;
  });

  return (
    <div className="h-72 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="week"
            tickFormatter={(v: number) => `W${v}`}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v >= 0 ? `+$${(v / 1000).toFixed(1)}k` : `-$${Math.abs(v / 1000).toFixed(1)}k`
            }
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: COLORS[value], fontSize: 13 }}>{value}</span>
            )}
          />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 2" strokeWidth={1.5} />
          {results.map((r) => (
            <Line
              key={r.plan.name}
              type="monotone"
              dataKey={r.plan.name}
              stroke={COLORS[r.plan.name]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

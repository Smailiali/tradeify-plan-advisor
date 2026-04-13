"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface DayResult {
  day: number;
  pnl: number;
  percentage: number;
  violates: boolean;
}

interface Props {
  days: DayResult[];
  threshold: number;
}

interface TooltipPayload {
  payload: DayResult;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3 text-sm shadow-xl">
      <p className="mb-1 font-semibold text-text-primary">Day {d.day}</p>
      <div className="flex justify-between gap-6">
        <span className="text-text-secondary">P&amp;L</span>
        <span className={`font-semibold ${d.pnl >= 0 ? "text-green-accent" : "text-red-accent"}`}>
          {d.pnl >= 0 ? "+" : ""}${d.pnl.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between gap-6">
        <span className="text-text-secondary">% of Total</span>
        <span className={`font-semibold ${d.violates ? "text-red-accent" : "text-green-accent"}`}>
          {d.percentage.toFixed(1)}%
        </span>
      </div>
      {d.violates && (
        <p className="mt-1 text-xs text-red-accent">Exceeds threshold</p>
      )}
    </div>
  );
}

export default function ConsistencyChart({ days, threshold }: Props) {
  const chartData = days.map((d) => ({
    ...d,
    label: `D${d.day}`,
  }));

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, Math.max(100, threshold + 20)]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />

          {/* Threshold reference line */}
          <ReferenceLine
            x={threshold}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 3"
            label={{
              value: `${threshold}% limit`,
              position: "right",
              fill: "#ef4444",
              fontSize: 11,
              fontWeight: 600,
            }}
          />

          <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.day}`}
                fill={entry.violates ? "#ef4444" : "#10b981"}
                fillOpacity={entry.violates ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

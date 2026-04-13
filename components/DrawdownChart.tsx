"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { DrawdownDay } from "@/types/plans";

interface Props {
  visibleData: DrawdownDay[];
  currentDay: number;
  totalDays: number;
}

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

  const balance = payload.find((p) => p.name === "Account Balance");
  const floor = payload.find((p) => p.name === "Drawdown Floor");
  const buffer = payload.find((p) => p.name === "Safe Zone");

  return (
    <div className="rounded-xl border border-[#1f2937] bg-[#111827] px-4 py-3 shadow-xl text-sm">
      <p className="mb-2 font-semibold text-text-primary">Day {label}</p>
      {balance && (
        <div className="flex justify-between gap-6">
          <span className="text-text-secondary">Balance</span>
          <span className="font-semibold text-green-accent">
            ${(balance.value as number).toLocaleString()}
          </span>
        </div>
      )}
      {floor && (
        <div className="flex justify-between gap-6">
          <span className="text-text-secondary">Floor</span>
          <span className="font-semibold text-red-accent">
            ${(floor.value as number).toLocaleString()}
          </span>
        </div>
      )}
      {balance && floor && (
        <div className="mt-1 flex justify-between gap-6 border-t border-[#1f2937] pt-1">
          <span className="text-text-secondary">Buffer</span>
          <span className="font-semibold text-amber-accent">
            ${((balance.value as number) - (floor.value as number)).toLocaleString()}
          </span>
        </div>
      )}
      {buffer && <div className="hidden">{buffer.value}</div>}
    </div>
  );
}

export default function DrawdownChart({ visibleData, currentDay, totalDays }: Props) {
  // Build chart data: include all days as skeleton, only populate visible ones
  const allDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  const chartData = allDays.map((day) => {
    const point = visibleData.find((d) => d.day === day);
    if (!point) return { day };
    return {
      day,
      balance: point.endBalance,
      floor: point.drawdownFloor,
      // Area fill between floor and balance for safe-zone shading
      safeZoneTop: point.endBalance,
      safeZoneBottom: point.drawdownFloor,
      locked: point.locked,
    };
  });

  // Find the lock day for a reference line
  const lockDay = visibleData.find((d) => d.locked)?.day;

  // Y-axis domain: give a little headroom
  const allBalances = visibleData.map((d) => d.endBalance);
  const allFloors = visibleData.map((d) => d.drawdownFloor);
  const yMin = Math.min(...allFloors) - 200;
  const yMax = Math.max(...allBalances) + 300;

  const fmt = (v: number) => `$${(v / 1000).toFixed(1)}k`;

  return (
    <div className="h-72 w-full md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <defs>
            <linearGradient id="safeZoneGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />

          <XAxis
            dataKey="day"
            tickFormatter={(v: number) => `D${v}`}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={fmt}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            width={62}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Safe-zone shaded area between balance and floor */}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="none"
            fill="url(#safeZoneGradient)"
            fillOpacity={1}
            name="Safe Zone"
            dot={false}
            activeDot={false}
            legendType="none"
            connectNulls={false}
          />

          {/* Drawdown floor — red dashed */}
          <Line
            type="monotone"
            dataKey="floor"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
            name="Drawdown Floor"
            connectNulls={false}
          />

          {/* Account balance — green solid */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props as { cx: number; cy: number; payload: { day: number; locked?: boolean } };
              if (!payload.locked) return <circle key={`dot-${payload.day}`} cx={cx} cy={cy} r={4} fill="#10b981" stroke="#111827" strokeWidth={2} />;
              return (
                <circle
                  key={`dot-${payload.day}`}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="#f59e0b"
                  stroke="#111827"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6, fill: "#10b981", strokeWidth: 0 }}
            name="Account Balance"
            connectNulls={false}
          />

          {/* Lock day reference line */}
          {lockDay && (
            <ReferenceLine
              x={lockDay}
              stroke="#f59e0b"
              strokeDasharray="4 2"
              strokeWidth={1.5}
              label={{
                value: "Floor Locked",
                position: "top",
                fill: "#f59e0b",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          )}

          {/* Current day indicator */}
          {currentDay <= totalDays && (
            <ReferenceLine
              x={currentDay}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

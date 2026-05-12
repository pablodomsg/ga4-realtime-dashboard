"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { TimeSeriesPoint } from "@/lib/types";

type LineChartCardProps = {
  title: string;
  data: TimeSeriesPoint[];
  loading?: boolean;
};

export function LineChartCard({ title, data, loading }: LineChartCardProps) {
  return (
    <ChartCard title={title} loading={loading} empty={data.length === 0}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Vistas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

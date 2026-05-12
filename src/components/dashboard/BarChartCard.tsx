"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NamedMetric } from "@/lib/types";

type BarChartCardProps = {
  title: string;
  data: NamedMetric[];
  loading?: boolean;
};

export function BarChartCard({ title, data, loading }: BarChartCardProps) {
  return (
    <ChartCard title={title} loading={loading} empty={data.length === 0}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 6, right: 12, left: 12, bottom: 0 }}
          >
            <CartesianGrid stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Bar dataKey="value" fill="#0f766e" radius={[0, 4, 4, 0]} name="Usuarios" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

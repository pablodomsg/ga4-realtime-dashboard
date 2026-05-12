"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { NamedMetric } from "@/lib/types";

const COLORS = ["#2563eb", "#0f766e", "#b45309", "#7c3aed", "#475569"];

type DonutChartCardProps = {
  title: string;
  data: NamedMetric[];
  loading?: boolean;
};

export function DonutChartCard({ title, data, loading }: DonutChartCardProps) {
  return (
    <ChartCard title={title} loading={loading} empty={data.length === 0}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

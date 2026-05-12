"use client";

import type { DateRangeKey } from "@/lib/types";
import { DateRangeSelector } from "./DateRangeSelector";

type DashboardHeaderProps = {
  range: DateRangeKey;
  onRangeChange: (range: DateRangeKey) => void;
};

export function DashboardHeader({ range, onRangeChange }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Google Analytics 4</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Dashboard realtime y historico
        </h1>
      </div>
      <DateRangeSelector value={range} onChange={onRangeChange} />
    </header>
  );
}

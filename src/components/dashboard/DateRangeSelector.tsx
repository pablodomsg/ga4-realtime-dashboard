"use client";

import type { DateRangeKey } from "@/lib/types";

const OPTIONS: Array<{ label: string; value: DateRangeKey }> = [
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
];

type DateRangeSelectorProps = {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
};

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-9 rounded-md px-3 text-sm font-medium transition ${
            value === option.value
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

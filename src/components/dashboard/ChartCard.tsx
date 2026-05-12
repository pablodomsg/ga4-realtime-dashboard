import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  empty?: boolean;
  loading?: boolean;
};

export function ChartCard({
  title,
  description,
  children,
  empty,
  loading,
}: ChartCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {loading ? (
        <div className="h-72 animate-pulse rounded-md bg-slate-100" />
      ) : empty ? (
        <EmptyState />
      ) : (
        children
      )}
    </section>
  );
}

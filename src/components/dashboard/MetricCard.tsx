type MetricCardProps = {
  label: string;
  value: number | string;
  helper?: string;
  loading?: boolean;
};

export function MetricCard({ label, value, helper, loading }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3">
        {loading ? (
          <div className="h-9 w-28 animate-pulse rounded bg-slate-100" />
        ) : (
          <p className="text-3xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        )}
      </div>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}

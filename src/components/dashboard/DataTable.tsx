import { EmptyState } from "./EmptyState";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right";
};

type DataTableProps<T> = {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
};

export function DataTable<T extends Record<string, string | number>>({
  title,
  data,
  columns,
  loading,
}: DataTableProps<T>) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {loading ? (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-9 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="mt-5">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`pb-3 font-medium ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`py-3 text-slate-700 ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

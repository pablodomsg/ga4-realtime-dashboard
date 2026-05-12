import type {
  DateRangeKey,
  MetricValue,
  NamedMetric,
  PageMetric,
  TimeSeriesPoint,
} from "./types";

type GaRow = {
  dimensionValues?: Array<{ value?: string | null } | null> | null;
  metricValues?: Array<{ value?: string | null } | null> | null;
};

export const DATE_RANGES: Record<DateRangeKey, { label: string; days: number }> = {
  "7d": { label: "7 dias", days: 7 },
  "30d": { label: "30 dias", days: 30 },
  "90d": { label: "90 dias", days: 90 },
};

export function parseRange(value: string | null): DateRangeKey {
  if (value === "30d" || value === "90d") {
    return value;
  }

  return "7d";
}

export function toGaDateRange(range: DateRangeKey) {
  const days = DATE_RANGES[range].days;

  return {
    startDate: `${days - 1}daysAgo`,
    endDate: "today",
  };
}

export function metric(row: GaRow | undefined, index = 0) {
  return Number(row?.metricValues?.[index]?.value ?? 0);
}

export function dimension(row: GaRow | undefined, index = 0, fallback = "Sin dato") {
  return row?.dimensionValues?.[index]?.value || fallback;
}

export function formatGaDate(value: string) {
  if (!/^\d{8}$/.test(value)) {
    return value;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

export function mapOverview(rows: GaRow[] = []): MetricValue[] {
  const row = rows[0];

  return [
    { label: "Usuarios", value: metric(row, 0) },
    { label: "Sesiones", value: metric(row, 1) },
    { label: "Eventos", value: metric(row, 2) },
  ];
}

export function mapTimeSeries(rows: GaRow[] = []): TimeSeriesPoint[] {
  return rows.map((row) => ({
    date: formatGaDate(dimension(row, 0)),
    views: metric(row, 0),
  }));
}

export function mapNamedMetric(rows: GaRow[] = [], dimensionIndex = 0): NamedMetric[] {
  return rows.map((row) => ({
    name: dimension(row, dimensionIndex),
    value: metric(row, 0),
  }));
}

export function mapChannels(rows: GaRow[] = []): NamedMetric[] {
  return rows.map((row) => {
    const channel = dimension(row, 0);
    const sourceMedium = dimension(row, 1, "");
    const name = sourceMedium ? `${channel} / ${sourceMedium}` : channel;

    return {
      name,
      value: metric(row, 0),
    };
  });
}

export function mapPages(rows: GaRow[] = []): PageMetric[] {
  return rows.map((row) => ({
    title: dimension(row, 0, "Sin titulo"),
    path: dimension(row, 1, "/"),
    views: metric(row, 0),
    users: metric(row, 1),
  }));
}

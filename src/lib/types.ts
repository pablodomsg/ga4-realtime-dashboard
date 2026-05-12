export type DateRangeKey = "7d" | "30d" | "90d";

export type ApiEnvelope<T> = {
  configured: boolean;
  data: T;
  error?: string;
};

export type MetricValue = {
  label: string;
  value: number;
};

export type TimeSeriesPoint = {
  date: string;
  views: number;
};

export type NamedMetric = {
  name: string;
  value: number;
};

export type PageMetric = {
  title: string;
  path: string;
  views: number;
  users: number;
};

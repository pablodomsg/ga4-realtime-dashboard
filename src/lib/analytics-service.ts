import type { protos } from "@google-analytics/data";
import {
  getAnalyticsClient,
  getGa4MissingEnvMessage,
  getGa4PropertyName,
} from "./ga4";
import {
  mapChannels,
  mapNamedMetric,
  mapOverview,
  mapPages,
  mapTimeSeries,
  toGaDateRange,
} from "./analytics-helpers";
import type { DateRangeKey } from "./types";

type RunReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;

async function runReport(request: Omit<RunReportRequest, "property">) {
  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: getGa4PropertyName(),
    ...request,
  });

  return response.rows ?? [];
}

async function runReportWithFallback(
  primary: Omit<RunReportRequest, "property">,
  fallback: Omit<RunReportRequest, "property">,
) {
  try {
    return await runReport(primary);
  } catch (error) {
    console.warn("Primary GA4 report failed. Retrying with fallback dimensions.", error);
    return runReport(fallback);
  }
}

export async function fetchRealtimeUsers() {
  const client = getAnalyticsClient();
  const [response] = await client.runRealtimeReport({
    property: getGa4PropertyName(),
    metrics: [{ name: "activeUsers" }],
  });

  return {
    activeUsers: Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0),
  };
}

export async function fetchOverview(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "eventCount" },
    ],
  });

  return mapOverview(rows);
}

export async function fetchTimeSeries(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  return mapTimeSeries(rows);
}

export async function fetchPages(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    limit: 10,
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  });

  return mapPages(rows);
}

export async function fetchEvents(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    limit: 10,
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  });

  return mapNamedMetric(rows);
}

export async function fetchChannels(range: DateRangeKey) {
  const rows = await runReportWithFallback(
    {
      dateRanges: [toGaDateRange(range)],
      dimensions: [{ name: "sessionDefaultChannelGroup" }, { name: "sessionSourceMedium" }],
      metrics: [{ name: "activeUsers" }],
      limit: 10,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    },
    {
      dateRanges: [toGaDateRange(range)],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "activeUsers" }],
      limit: 10,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    },
  );

  return mapChannels(rows);
}

export async function fetchCountries(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    limit: 10,
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
  });

  return mapNamedMetric(rows);
}

export async function fetchDevices(range: DateRangeKey) {
  const rows = await runReport({
    dateRanges: [toGaDateRange(range)],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }],
    limit: 10,
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
  });

  return mapNamedMetric(rows);
}

export function missingConfigPayload<T>(data: T) {
  return {
    configured: false,
    data,
    error: getGa4MissingEnvMessage(),
  };
}

export function successPayload<T>(data: T) {
  return {
    configured: true,
    data,
  };
}

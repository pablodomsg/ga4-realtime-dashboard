import { NextResponse } from "next/server";
import { getGa4ConfigStatus } from "./ga4";
import {
  fetchChannels,
  fetchCountries,
  fetchDevices,
  fetchEvents,
  fetchOverview,
  fetchPages,
  fetchRealtimeUsers,
  fetchTimeSeries,
  missingConfigPayload,
  successPayload,
} from "./analytics-service";
import { parseRange } from "./analytics-helpers";

type HandlerName =
  | "realtime"
  | "overview"
  | "timeseries"
  | "pages"
  | "events"
  | "channels"
  | "countries"
  | "devices";

const EMPTY_DATA = {
  realtime: { activeUsers: 0 },
  overview: [],
  timeseries: [],
  pages: [],
  events: [],
  channels: [],
  countries: [],
  devices: [],
};

const HISTORICAL_CACHE = "s-maxage=600, stale-while-revalidate=300";

export async function analyticsResponse(name: HandlerName, request?: Request) {
  const status = getGa4ConfigStatus();
  const headers = {
    "Cache-Control": name === "realtime" ? "no-store" : HISTORICAL_CACHE,
  };

  if (!status.configured) {
    return NextResponse.json(missingConfigPayload(EMPTY_DATA[name]), { headers });
  }

  try {
    const url = request ? new URL(request.url) : undefined;
    const range = parseRange(url?.searchParams.get("range") ?? null);
    const data = await getData(name, range);

    return NextResponse.json(successPayload(data), { headers });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo obtener datos de Google Analytics.";

    return NextResponse.json(
      {
        configured: true,
        data: EMPTY_DATA[name],
        error: message,
      },
      { status: 500, headers },
    );
  }
}

function getData(name: HandlerName, range: ReturnType<typeof parseRange>) {
  switch (name) {
    case "realtime":
      return fetchRealtimeUsers();
    case "overview":
      return fetchOverview(range);
    case "timeseries":
      return fetchTimeSeries(range);
    case "pages":
      return fetchPages(range);
    case "events":
      return fetchEvents(range);
    case "channels":
      return fetchChannels(range);
    case "countries":
      return fetchCountries(range);
    case "devices":
      return fetchDevices(range);
  }
}

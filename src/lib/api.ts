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
    const message = getAnalyticsErrorMessage(error);
    console.error("GA4 request failed", getSafeErrorLog(error));

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

function getAnalyticsErrorMessage(error: unknown) {
  const parts = extractErrorParts(error).filter(Boolean);
  const message = parts.find(
    (part) => part && !part.includes("undefined undefined: undefined"),
  );

  if (message?.includes("PERMISSION_DENIED") || hasErrorCode(error, 7)) {
    return "GA4 ha rechazado la peticion por permisos. Anade GOOGLE_CLIENT_EMAIL como Lector/Viewer en la propiedad GA4 y verifica que GA_PROPERTY_ID sea correcto.";
  }

  if (message?.includes("API has not been used") || message?.includes("SERVICE_DISABLED")) {
    return "Google Analytics Data API no esta habilitada en el proyecto de Google Cloud de la service account.";
  }

  if (
    message?.includes("DECODER routines") ||
    message?.includes("PEM") ||
    message?.includes("private key")
  ) {
    return "GOOGLE_PRIVATE_KEY no tiene un formato valido. Copia el valor private_key completo del JSON nuevo, sin cambiar BEGIN/END ni los saltos de linea.";
  }

  return message ?? "No se pudo obtener datos de Google Analytics. Revisa permisos de GA4, GA_PROPERTY_ID y que Google Analytics Data API este habilitada.";
}

function extractErrorParts(error: unknown): string[] {
  if (!error || typeof error !== "object") {
    return [String(error)];
  }

  const record = error as Record<string, unknown>;
  const response = record.response as Record<string, unknown> | undefined;
  const responseData = response?.data as Record<string, unknown> | undefined;
  const responseError = responseData?.error as Record<string, unknown> | undefined;

  return [
    typeof record.details === "string" ? record.details : undefined,
    typeof record.message === "string" ? record.message : undefined,
    typeof responseError?.message === "string" ? responseError.message : undefined,
    typeof responseData?.error_description === "string"
      ? responseData.error_description
      : undefined,
    typeof record.code === "number" ? `code ${record.code}` : undefined,
  ].filter((part): part is string => Boolean(part));
}

function hasErrorCode(error: unknown, code: number) {
  return Boolean(error && typeof error === "object" && (error as { code?: unknown }).code === code);
}

function getSafeErrorLog(error: unknown) {
  if (!error || typeof error !== "object") {
    return { error: String(error) };
  }

  const record = error as Record<string, unknown>;

  return {
    name: record.name,
    code: record.code,
    details: record.details,
    message: record.message,
  };
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

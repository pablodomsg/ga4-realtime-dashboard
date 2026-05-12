"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ApiEnvelope,
  DateRangeKey,
  MetricValue,
  NamedMetric,
  PageMetric,
  TimeSeriesPoint,
} from "@/lib/types";
import { BarChartCard } from "./BarChartCard";
import { DashboardHeader } from "./DashboardHeader";
import { DataTable } from "./DataTable";
import { DonutChartCard } from "./DonutChartCard";
import { ErrorState } from "./ErrorState";
import { LineChartCard } from "./LineChartCard";
import { MetricCard } from "./MetricCard";

type HistoricalState = {
  overview: MetricValue[];
  timeseries: TimeSeriesPoint[];
  pages: PageMetric[];
  events: NamedMetric[];
  channels: NamedMetric[];
  countries: NamedMetric[];
  devices: NamedMetric[];
};

const initialHistoricalState: HistoricalState = {
  overview: [],
  timeseries: [],
  pages: [],
  events: [],
  channels: [],
  countries: [],
  devices: [],
};

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T>> {
  const response = await fetch(url);
  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(body.error ?? "Error cargando datos de Analytics.");
  }

  return body;
}

export function DashboardClient() {
  const [range, setRange] = useState<DateRangeKey>("7d");
  const [realtimeUsers, setRealtimeUsers] = useState(0);
  const [historical, setHistorical] = useState<HistoricalState>(
    initialHistoricalState,
  );
  const [realtimeLoading, setRealtimeLoading] = useState(true);
  const [historicalLoading, setHistoricalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewByLabel = useMemo(
    () =>
      historical.overview.reduce<Record<string, number>>((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
    [historical.overview],
  );

  const loadRealtime = useCallback(async () => {
    try {
      const payload = await fetchJson<{ activeUsers: number }>(
        "/api/analytics/realtime",
      );

      if (!payload.configured) {
        setError(payload.error ?? "Faltan variables de entorno de GA4.");
      } else {
        setRealtimeUsers(payload.data.activeUsers);
      }
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "No se pudo cargar realtime.",
      );
    } finally {
      setRealtimeLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRealtime, 0);

    const intervalId = window.setInterval(loadRealtime, 60_000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [loadRealtime]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistorical() {
      setHistoricalLoading(true);
      setError(null);

      try {
        const [
          overview,
          timeseries,
          pages,
          events,
          channels,
          countries,
          devices,
        ] = await Promise.all([
          fetchJson<MetricValue[]>(`/api/analytics/overview?range=${range}`),
          fetchJson<TimeSeriesPoint[]>(`/api/analytics/timeseries?range=${range}`),
          fetchJson<PageMetric[]>(`/api/analytics/pages?range=${range}`),
          fetchJson<NamedMetric[]>(`/api/analytics/events?range=${range}`),
          fetchJson<NamedMetric[]>(`/api/analytics/channels?range=${range}`),
          fetchJson<NamedMetric[]>(`/api/analytics/countries?range=${range}`),
          fetchJson<NamedMetric[]>(`/api/analytics/devices?range=${range}`),
        ]);

        const firstUnconfigured = [
          overview,
          timeseries,
          pages,
          events,
          channels,
          countries,
          devices,
        ].find((payload) => !payload.configured);

        if (cancelled) {
          return;
        }

        if (firstUnconfigured) {
          setError(firstUnconfigured.error ?? "Faltan variables de entorno de GA4.");
        }

        setHistorical({
          overview: overview.data,
          timeseries: timeseries.data,
          pages: pages.data,
          events: events.data,
          channels: channels.data,
          countries: countries.data,
          devices: devices.data,
        });
      } catch (currentError) {
        if (!cancelled) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "No se pudieron cargar datos historicos.",
          );
        }
      } finally {
        if (!cancelled) {
          setHistoricalLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(loadHistorical, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [range]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardHeader range={range} onRangeChange={setRange} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {error ? <ErrorState message={error} /> : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Usuarios activos ahora"
            value={realtimeUsers.toLocaleString("es-ES")}
            helper="Realtime GA4, refresca cada 60 segundos"
            loading={realtimeLoading}
          />
          <MetricCard
            label="Usuarios"
            value={(overviewByLabel.Usuarios ?? 0).toLocaleString("es-ES")}
            helper={`Ultimos ${range.replace("d", "")} dias`}
            loading={historicalLoading}
          />
          <MetricCard
            label="Sesiones"
            value={(overviewByLabel.Sesiones ?? 0).toLocaleString("es-ES")}
            helper={`Ultimos ${range.replace("d", "")} dias`}
            loading={historicalLoading}
          />
          <MetricCard
            label="Eventos"
            value={(overviewByLabel.Eventos ?? 0).toLocaleString("es-ES")}
            helper={`Ultimos ${range.replace("d", "")} dias`}
            loading={historicalLoading}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <LineChartCard
              title="Vistas por dia"
              data={historical.timeseries}
              loading={historicalLoading}
            />
          </div>
          <BarChartCard
            title="Usuarios por canal / source medium"
            data={historical.channels}
            loading={historicalLoading}
          />
          <BarChartCard
            title="Usuarios por pais"
            data={historical.countries}
            loading={historicalLoading}
          />
          <DonutChartCard
            title="Usuarios por dispositivo"
            data={historical.devices}
            loading={historicalLoading}
          />
          <BarChartCard
            title="Eventos principales"
            data={historical.events}
            loading={historicalLoading}
          />
        </section>

        <DataTable
          title="Paginas mas vistas"
          data={historical.pages}
          loading={historicalLoading}
          columns={[
            { key: "title", label: "Titulo" },
            { key: "path", label: "Ruta" },
            { key: "views", label: "Vistas", align: "right" },
            { key: "users", label: "Usuarios", align: "right" },
          ]}
        />
      </main>
    </div>
  );
}

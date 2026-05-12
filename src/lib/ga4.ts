import { BetaAnalyticsDataClient } from "@google-analytics/data";

export type Ga4ConfigStatus = {
  configured: boolean;
  missing: string[];
};

let analyticsClient: BetaAnalyticsDataClient | null = null;

const REQUIRED_ENV = [
  "GA_PROPERTY_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
] as const;

export function getGa4ConfigStatus(): Ga4ConfigStatus {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function getGa4MissingEnvMessage() {
  const status = getGa4ConfigStatus();

  if (status.configured) {
    return undefined;
  }

  return `Faltan variables de entorno para conectar con GA4: ${status.missing.join(", ")}. Configura GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL y GOOGLE_PRIVATE_KEY.`;
}

export function getGa4PropertyName() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    throw new Error("GA_PROPERTY_ID is not configured.");
  }

  return `properties/${propertyId}`;
}

export function getAnalyticsClient() {
  const status = getGa4ConfigStatus();

  if (!status.configured) {
    throw new Error(getGa4MissingEnvMessage());
  }

  if (!analyticsClient) {
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });
  }

  return analyticsClient;
}

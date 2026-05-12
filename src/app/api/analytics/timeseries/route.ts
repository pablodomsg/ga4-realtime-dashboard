import { analyticsResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return analyticsResponse("timeseries", request);
}

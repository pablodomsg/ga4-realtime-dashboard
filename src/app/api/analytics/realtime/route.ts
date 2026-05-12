import { analyticsResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export function GET() {
  return analyticsResponse("realtime");
}

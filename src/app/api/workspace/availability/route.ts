import { proxyToBackend } from "@/lib/api/proxy";

/** Proxies to `POST /clinician/availability` - add a time to the signed-in doctor's own availability. */
export function POST(request: Request) {
  return proxyToBackend(request, "/clinician/availability", {
    method: "POST",
    fallbackError: "Could not add that time.",
  });
}

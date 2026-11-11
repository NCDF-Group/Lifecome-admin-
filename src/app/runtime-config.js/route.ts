import { browserConfig, readConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(browserConfig(readConfig()), {
    headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" },
  });
}

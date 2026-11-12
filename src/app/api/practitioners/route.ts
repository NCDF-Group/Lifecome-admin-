import { readConfig } from "@/lib/config";
import { ROLES } from "@/lib/roles";
import { listPractitioners } from "@/lib/users";

export const dynamic = "force-dynamic";

/** The patient app may be hosted on its own origin (PATIENT_APP_URL): allow just that origin to read. */
function corsHeaders(): Record<string, string> {
  const app = readConfig().patientAppUrl;
  return app ? { "Access-Control-Allow-Origin": new URL(app).origin, Vary: "Origin" } : {};
}

/** Public, read-only list of practitioners for the patient app. Contains no emails or account details. */
export function GET() {
  return Response.json(
    {
      updatedAt: Date.now(),
      roles: ROLES.filter((r) => r.key !== "superadmin").map((r) => ({ key: r.key, label: r.label })),
      practitioners: listPractitioners(),
    },
    { headers: { "Cache-Control": "no-store", ...corsHeaders() } },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...corsHeaders(), "Access-Control-Allow-Methods": "GET" } });
}

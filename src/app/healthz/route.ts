export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", application: "LifeCome Health Professional Portal", mode: "demo", clinicalBackend: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import { z } from "zod";

/** Fails fast at boot with a clear message instead of a cryptic runtime
 * error the first time a missing env var is read.
 *
 * Server-only (no NEXT_PUBLIC_ prefix) on purpose: every reader of this is a Route Handler
 * under app/api, or something only they import - nothing in a "use client" component ever
 * reads it, so it has no reason to be bundled into browser JS. */
const envSchema = z.object({
  API_URL: z.string().url(),
});

export const env = envSchema.parse({
  API_URL: process.env.API_URL,
});

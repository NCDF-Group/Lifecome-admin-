import { z } from "zod";

/** Fails fast at boot with a clear message instead of a cryptic runtime
 * error the first time a missing env var is read. */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const N = 16384;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN, { N });
  return `scrypt$${N}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, n, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !n || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length, { N: Number(n) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function randomId(): string {
  return randomBytes(12).toString("base64url");
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "Password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) return "Include at least one letter and one number.";
  return null;
}

export function normaliseEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const value = email.trim().toLowerCase();
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

/** In-memory throttle for sign-in attempts (per process). */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function throttle(key: string, max: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  entry.count += 1;
  return { allowed: entry.count <= max, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
}

export function clearThrottle(key: string) {
  attempts.delete(key);
}

/** A readable default password that satisfies the password policy, e.g. "Kq7m-x4Pr-W9tz". */
export function generatePassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(12);
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  chars[1] = String(2 + (bytes[1] % 8)); // guarantee a digit
  chars[0] = "ABCDEFGHJKMNPQRSTUVWXYZ"[bytes[0] % 23]; // and a letter
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8).join("")}`;
}

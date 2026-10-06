"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatAppointmentTime } from "@/features/bookings/labels";
import type { AvailabilitySlot } from "../types";

const DURATIONS = [15, 20, 30, 45, 60];

/**
 * The doctor's open and booked time slots, with a form to add one. Writes go through
 * `/api/workspace/availability` (which proxies to the backend's `/clinician/availability`, scoped to
 * the signed-in doctor's own provider profile).
 */
export function AvailabilityManager({ slots }: { slots: AvailabilitySlot[] }) {
  const router = useRouter();
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // datetime-local has no zone; the console works in West Africa Time (UTC+1, no DST).
      const iso = new Date(`${startsAt}:00+01:00`).toISOString();
      const response = await fetch("/api/workspace/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startsAt: iso, durationMinutes: duration }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
        setError(body?.error ?? "Could not add that time.");
        return;
      }
      setStartsAt("");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeSlot(slot: AvailabilitySlot) {
    setError(null);
    const response = await fetch(`/api/workspace/availability/${slot.id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
      setError(body?.error ?? "Could not remove that time.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={addSlot}
        className="flex flex-wrap items-end gap-3 rounded-card border border-line bg-card p-5"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slot-start" className="text-sm font-medium text-ink">
            Starts (West Africa Time)
          </label>
          <input
            id="slot-start"
            type="datetime-local"
            required
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue/30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slot-duration" className="text-sm font-medium text-ink">
            Length
          </label>
          <select
            id="slot-duration"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue/30"
          >
            {DURATIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={busy || !startsAt}
          className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="size-4" />
          {busy ? "Adding..." : "Add time"}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <section className="rounded-card border border-line bg-card">
        <h2 className="border-b border-line px-5 py-3 text-base font-bold text-ink">
          Upcoming times ({slots.length})
        </h2>
        {slots.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink-muted">
            No upcoming times yet. Add the times patients can book with you.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {slots.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{formatAppointmentTime(slot.startsAt)}</p>
                  <p className="text-xs text-ink-muted">
                    {slot.durationMinutes} minutes · {slot.isBooked ? "Booked" : "Open"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSlot(slot)}
                  disabled={slot.isBooked}
                  title={slot.isBooked ? "Already booked" : "Remove this time"}
                  aria-label="Remove this time"
                  className="flex size-8 items-center justify-center rounded-control text-ink-muted hover:bg-surface hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

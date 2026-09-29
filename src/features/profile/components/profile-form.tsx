"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { inputClass, sendProfileRequest, submitClass } from "./field";

/** Edits the signed-in staff member's name via `PATCH /api/profile`. Email and role are shown
 * read-only - the backend doesn't let staff change either on their own account. */
export function ProfileForm({ fullName: initialName, email, role }: { fullName: string; email: string; role: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [status, setStatus] = useState<{ kind: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const error = await sendProfileRequest("/api/profile", "PATCH", { fullName }, "Could not update your profile.");
    setSubmitting(false);

    if (error) {
      setStatus({ kind: "error", message: error });
      return;
    }
    setStatus({ kind: "success", message: "Profile updated." });
    // Re-renders the server layout so the top bar and avatar pick up the new name.
    router.refresh();
  }

  const unchanged = fullName.trim() === initialName;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-full-name" className="text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="profile-full-name"
          required
          maxLength={200}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="profile-email" value={email} disabled className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-role" className="text-sm font-medium text-ink">
            Role
          </label>
          <input id="profile-role" value={role} disabled className={inputClass} />
        </div>
      </div>

      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`text-sm font-medium ${status.kind === "error" ? "text-destructive" : "text-positive"}`}
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={submitting || unchanged || fullName.trim() === ""} className={submitClass}>
        {submitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

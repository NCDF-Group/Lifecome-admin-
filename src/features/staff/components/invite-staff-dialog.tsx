"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { staffRoleLabel, type StaffRole } from "@/lib/auth/roles";

const roles: StaffRole[] = [
  "platform_administrator",
  "clinical_administrator",
  "hmo_operations",
  "support_agent",
];

/** The "Invite staff member" flow: creates a real account via `POST /api/staff` (proxying to the
 * backend's `POST /admin/staff`), then refreshes the page so the new row shows up in the list. */
export function InviteStaffDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("support_agent");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("support_agent");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
        setError(body?.error ?? "Could not create the staff account.");
        return;
      }

      setOpen(false);
      reset();
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:opacity-90"
        >
          <UserPlus className="size-4" />
          Invite staff member
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-card bg-card p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-ink">Invite staff member</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-control text-ink-muted hover:bg-surface"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="invite-full-name" className="text-sm font-medium text-ink">
                Full name
              </label>
              <input
                id="invite-full-name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="invite-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="invite-password" className="text-sm font-medium text-ink">
                Temporary password
              </label>
              <input
                id="invite-password"
                type="password"
                required
                minLength={10}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 10 characters"
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="invite-role" className="text-sm font-medium text-ink">
                Role
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(event) => setRole(event.target.value as StaffRole)}
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue/30"
              >
                {roles.map((value) => (
                  <option key={value} value={value}>
                    {staffRoleLabel[value]}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./icon";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="c-btn ghost"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
      }}
    >
      <Icon name="logout" size={16} /> Sign out
    </button>
  );
}

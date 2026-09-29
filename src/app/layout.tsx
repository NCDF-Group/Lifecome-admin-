import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isThemePreference, THEME_COOKIE } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeCome Live - Operations console",
  description:
    "Admin, payer ops, support and audit tooling for LifeCome Live staff.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const theme = isThemePreference(stored) ? stored : "system";

  return (
    // The avatar menu changes `data-theme` on the client without a re-render of this element.
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

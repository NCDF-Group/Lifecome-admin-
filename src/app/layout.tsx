import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import Script from "next/script";
import "@/styles/portal.css";
import "@/styles/console.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "LifeCome Health | Professional Portal", template: "%s | LifeCome Health" },
  description: "LifeCome Health professional portal with a connected patient app.",
};

export const viewport: Viewport = { themeColor: "#102c3c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

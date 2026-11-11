"use client";

import Script from "next/script";

/**
 * Mount point for the interactive professional portal. The workflow engine in
 * /portal.js renders into #app and #toast and routes on the URL hash. Links to
 * this page elsewhere in the app are plain anchors so the engine always boots
 * on a fresh document.
 */
export function PortalRuntime() {
  return (
    <>
      <div id="app" suppressHydrationWarning />
      <div id="toast" role="status" aria-live="polite" suppressHydrationWarning />
      <Script src="/portal.js" strategy="afterInteractive" />
    </>
  );
}

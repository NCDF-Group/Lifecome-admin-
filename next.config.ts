import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/patient-app.html", destination: "/patient-app", permanent: true },
      // The bundled patient app is a static site; its relative assets need the folder URL.
      { source: "/patient", destination: "/patient/index.html", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

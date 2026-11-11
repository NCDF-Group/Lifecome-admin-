const PATHS: Record<string, string> = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  people: "M14 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M2 22v-5a7 7 0 0 1 14 0v5 M17 3a4 4 0 0 1 0 8 M18 14a5 5 0 0 1 4 5v3",
  roles: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z m-4 10 3 3 5-6",
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  log: "M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5",
  plus: "M12 4v16 M4 12h16",
  copy: "M9 9h11v11H9z M5 15H4V4h11v1",
  check: "m5 12 4 4L19 6",
  arrow: "M4 12h16 m-6-6 6 6-6 6",
  logout: "M9 4H4v16h5 M16 8l4 4-4 4 M20 12H9",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2",
  lock: "M5 10h14v12H5z M8 10V6a4 4 0 0 1 8 0v4",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  external: "M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6",
};

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg className="c-ico" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.dashboard} />
    </svg>
  );
}

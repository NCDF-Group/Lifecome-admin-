import { Search } from "lucide-react";

export function DataTableToolbar({
  value,
  onChange,
  placeholder,
  resultCount,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  resultCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full min-w-0 sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-control border border-line bg-card py-2 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
      </div>
      <span className="shrink-0 text-xs whitespace-nowrap text-ink-muted">
        {resultCount} results
      </span>
    </div>
  );
}

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataTablePagination<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <div className="flex items-center justify-between text-xs text-ink-muted">
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {Math.max(table.getPageCount(), 1)}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex size-7 items-center justify-center rounded-control border border-line disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex size-7 items-center justify-center rounded-control border border-line disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

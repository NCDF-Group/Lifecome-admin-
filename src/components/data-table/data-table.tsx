"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

/**
 * The shared table every feature's list page renders: sorting, a global
 * text filter and pagination, styled once here instead of by each
 * feature. Row click navigation is the caller's job (`onRowClick`) since
 * each feature routes to a different detail page.
 */
export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search",
  onRowClick,
}: {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        value={globalFilter}
        onChange={setGlobalFilter}
        placeholder={searchPlaceholder}
        resultCount={table.getFilteredRowModel().rows.length}
      />

      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2.5 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    role={header.column.getCanSort() ? "button" : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {{ asc: " ↑", desc: " ↓" }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-line bg-card">
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-ink-muted"
                >
                  No results.
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={
                  onRowClick ? "cursor-pointer hover:bg-surface" : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-ink">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./pagination";
import { SearchIcon, XIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  mode?: "client" | "server";
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onSelectionChange?: (data: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  mode = "client",
  loading = false,
  error,
  onRetry,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    ...(mode === "client"
      ? {
          getPaginationRowModel: getPaginationRowModel(),
        }
      : {}),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    ...(mode === "server"
      ? {
          manualPagination: true,
          pageCount: Math.ceil((total ?? 0) / (limit ?? 10)),
          onPaginationChange: (updater) => {
            if (!onPageChange || !onLimitChange) return;

            const next =
              typeof updater === "function"
                ? updater({
                    pageIndex: (page ?? 1) - 1,
                    pageSize: limit ?? 10,
                  })
                : updater;

            onPageChange(next.pageIndex + 1);
            onLimitChange(next.pageSize);
          },
        }
      : {}),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination:
        mode === "server"
          ? {
              pageIndex: (page ?? 1) - 1,
              pageSize: limit ?? 10,
            }
          : undefined,
    },
  });

  useEffect(() => {
    const selected = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    onSelectionChange?.(selected);
  }, [rowSelection]);

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table role="table" aria-busy={loading}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // 👇 FILA DE CARGANDO
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span className="animate-spin border-2 border-gray-300 border-t-transparent rounded-full w-5 h-5"></span>
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border">
                    <XIcon className="w-6 h-6 text-destructive" />
                    <p className="font-medium text-destructive">
                      Ocurrió un error al cargar los datos
                    </p>
                    <p className="text-sm opacity-80 max-w-md text-destructive">
                      {error}
                    </p>

                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="px-3 py-1 text-sm border rounded-md text-primary hover:bg-primary/10 transition"
                      >
                        Reintentar
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center py-10 text-muted-foreground">
                    <SearchIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No se encontraron resultados</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {table
            .getFooterGroups()
            .some((group) =>
              group.headers.some((header) => header.column.columnDef.footer)
            ) && (
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </div>
      {page && limit ? <DataTablePagination table={table} /> : null}
    </div>
  );
}

import { SimpleCard } from "@/components/simple-card";
import { useReporteAnual } from "../hooks/useReporteDiezmo";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  DiezmoReporteAnual,
  DiezmoReporteAnualResponse,
} from "../types/diezmos-report";

import { useState, useMemo } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import xlsx from "json-as-xlsx";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

const MONTHS = [
  { id: "01", name: "Enero" },
  { id: "02", name: "Febrero" },
  { id: "03", name: "Marzo" },
  { id: "04", name: "Abril" },
  { id: "05", name: "Mayo" },
  { id: "06", name: "Junio" },
  { id: "07", name: "Julio" },
  { id: "08", name: "Agosto" },
  { id: "09", name: "Septiembre" },
  { id: "10", name: "Octubre" },
  { id: "11", name: "Noviembre" },
  { id: "12", name: "Diciembre" },
];

const DiezmosReportAnual = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReporteAnual(year);

  // Helper to calculate amount for a specific month
  const getMontoForMonth = (
    meses: DiezmoReporteAnual[],
    month: string
  ): number => {
    return meses
      .filter(
        (d) =>
          d.mes_correspondiente.split("-")[1].toLowerCase() ===
          month.toLowerCase()
      )
      .reduce((acc, curr) => acc + Number(curr.monto_mes), 0);
  };

  const columns: ColumnDef<DiezmoReporteAnualResponse>[] = [
    {
      accessorKey: "miembro",
      header: "Nombres",
      cell: ({ row }) => {
        const miembro = row.original.miembro; // Accessed from original to be safe, though accessorKey works if flattened
        return (
          <div className="font-medium text-xs">
            {miembro.nombres} {miembro.apellidos}
          </div>
        );
      },
      footer: () => <div className="font-bold">TOTAL</div>,
    },
    ...MONTHS.map(
      (month) =>
        ({
          id: month.id,
          header: month.name,
          cell: ({ row }) => {
            const amount = getMontoForMonth(row.original.meses, month.id);
            return amount > 0 ? (
              <span className="text-green-600 font-medium text-xs">
                {amount.toLocaleString("es-PE", {
                  style: "currency",
                  currency: "PEN",
                })}
              </span>
            ) : (
              <span>-</span>
            );
          },
          footer: ({ table }) => {
            const total = table
              .getFilteredRowModel()
              .rows.reduce((acc, row) => {
                return acc + getMontoForMonth(row.original.meses, month.id);
              }, 0);
            return (
              <span className="font-bold text-xs">
                {total.toLocaleString("es-PE", {
                  style: "currency",
                  currency: "PEN",
                })}
              </span>
            );
          },
        } as ColumnDef<DiezmoReporteAnualResponse>)
    ),
    {
      id: "total_anual",
      header: "Total Anual",
      cell: ({ row }) => {
        const total = row.original.meses.reduce(
          (a, b) => a + Number(b.monto_mes),
          0
        );
        return (
          <span className="font-bold text-xs">
            {total.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })}
          </span>
        );
      },
      footer: ({ table }) => {
        const total = table.getFilteredRowModel().rows.reduce((acc, row) => {
          return (
            acc +
            row.original.meses.reduce((a, b) => a + Number(b.monto_mes), 0)
          );
        }, 0);
        return (
          <span className="font-bold">
            {total.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })}
          </span>
        );
      },
    },
  ];

  const dataToExcel = useMemo(() => {
    if (!data) return [];

    // 1. Define Columns
    const excelColumns = [
      { label: "Nombres", value: "nombres" },
      ...MONTHS.map((m) => ({
        label: m.name,
        value: m.id,
      })),
      { label: "Total Anual", value: "total" },
    ];

    // 2. Transform Data (Rows)
    const content = data.map((item) => {
      const row: any = {
        nombres: `${item.miembro.nombres} ${item.miembro.apellidos}`,
        total: item.meses.reduce(
          (acc, curr) => acc + Number(curr.monto_mes),
          0
        ),
      };

      MONTHS.forEach((month) => {
        const amount = getMontoForMonth(item.meses, month.id);
        row[month.id] = amount || ""; // Use empty string for visual cleanliness
      });

      return row;
    });

    // 3. Calculate Footer Totals
    const totalRow: any = {
      nombres: "TOTAL GENERAL",
      total: content.reduce((sum, row) => sum + (row.total || 0), 0),
    };

    MONTHS.forEach((month) => {
      totalRow[month.id] = content.reduce((sum, row) => {
        const val = row[month.id];
        return sum + (typeof val === "number" ? val : 0);
      }, 0);
    });

    return [
      {
        sheet: "Reporte de Diezmos Anual",
        columns: excelColumns,
        content: [...content, totalRow],
      },
    ];
  }, [data]);

  return (
    <div>
      <SimpleCard
        title="Reporte de Diezmos Anual"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => xlsx(dataToExcel)} variant="excel">
              Descargar Excel <DownloadIcon />
            </Button>
            <Select
              value={String(year)}
              onValueChange={(value) => setYear(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={data ?? []}
          mode="server" // Using server mode for existing logic, but totals are calculated client-side on displayed data
          loading={isLoading || isFetching}
          error={isError ? error.message : undefined}
          onRetry={refetch}
          // Assuming we might want to extend DataTable props to support showing all rows if 'limit' is used,
          // but here we are just viewing what's returned.
        />
      </SimpleCard>
    </div>
  );
};

export default DiezmosReportAnual;

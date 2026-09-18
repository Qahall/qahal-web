import { SimpleCard } from "@/components/simple-card";
import { useReporteMensual } from "../hooks/useReporteDiezmo";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DiezmoReporteMensualResponse } from "../types/diezmos-report";
import { DataTable } from "@/components/tables/data-table";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import xlsx from "json-as-xlsx";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

const DiezmosReportMensual = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReporteMensual(year, month);

  const servicesForMonth = useMemo(() => {
    const services: {
      date: string;
      service: string;
      label: string;
      fullDate: Date;
    }[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD matches API

      if (dayOfWeek === 0) {
        // Domingo
        services.push(
          {
            date: dateString,
            service: "central",
            label: "Central",
            fullDate: date,
          },
          {
            date: dateString,
            service: "aymara",
            label: "Aymara",
            fullDate: date,
          },
          {
            date: dateString,
            service: "adoracion",
            label: "Adoración",
            fullDate: date,
          }
        );
      } else if (dayOfWeek === 2) {
        // Martes
        services.push({
          date: dateString,
          service: "oracion",
          label: "Oración",
          fullDate: date,
        });
      }
    }
    return services;
  }, [year, month]);

  const columns = useMemo<ColumnDef<DiezmoReporteMensualResponse>[]>(() => {
    const dynamicColumns: ColumnDef<DiezmoReporteMensualResponse>[] =
      servicesForMonth.map((colInfo) => ({
        id: `${colInfo.date}-${colInfo.service}`,
        header: () => (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold">
              {colInfo.fullDate.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
              })}
            </span>
            <span className="text-[10px] font-normal uppercase">
              {colInfo.label}
            </span>
          </div>
        ),
        cell: ({ row }: { row: Row<DiezmoReporteMensualResponse> }) => {
          const diezmosMethod = row.original.diezmos;
          const total = diezmosMethod
            .filter(
              (d) =>
                d.fecha_diezmo === colInfo.date &&
                d.servicio === colInfo.service
            )
            .reduce((acc, curr) => acc + Number(curr.monto), 0);

          return total > 0 ? (
            <div className="text-center text-xs font-medium text-green-700">
              {total.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-300">-</div>
          );
        },
        footer: ({ table }: { table: any }) => {
          // table type is complex, using any for simplicity or Table<T> if imported
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (acc: number, row: Row<DiezmoReporteMensualResponse>) => {
                const rowTotal = row.original.diezmos
                  .filter(
                    (d) =>
                      d.fecha_diezmo === colInfo.date &&
                      d.servicio === colInfo.service
                  )
                  .reduce((sum, d) => sum + Number(d.monto), 0);
                return acc + rowTotal;
              },
              0
            );

          return (
            <div className="text-center text-xs font-bold">
              {total.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          );
        },
      }));

    return [
      {
        accessorKey: "miembro",
        header: "Nombres",
        cell: ({ row }: { row: Row<DiezmoReporteMensualResponse> }) => {
          const miembro = row.original.miembro;
          return (
            <div className="font-medium text-xs whitespace-nowrap min-w-[150px]">
              {miembro.nombres} {miembro.apellidos}
            </div>
          );
        },
        footer: () => <div className="font-bold text-xs">TOTAL</div>,
      },
      ...dynamicColumns,
      {
        id: "total_mensual",
        header: "Total Mensual",
        cell: ({ row }: { row: Row<DiezmoReporteMensualResponse> }) => {
          const total = row.original.diezmos.reduce(
            (acc, curr) => acc + Number(curr.monto),
            0
          );
          return (
            <div className="font-bold text-xs text-center">
              {total.toLocaleString("es-PE", {
                style: "currency",
                currency: "PEN",
              })}
            </div>
          );
        },
        footer: ({ table }: { table: any }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (acc: number, row: Row<DiezmoReporteMensualResponse>) => {
                return (
                  acc +
                  row.original.diezmos.reduce(
                    (sum, d) => sum + Number(d.monto),
                    0
                  )
                );
              },
              0
            );
          return (
            <div className="font-bold text-xs text-center">
              {total.toLocaleString("es-PE", {
                style: "currency",
                currency: "PEN",
              })}
            </div>
          );
        },
      },
    ];
  }, [servicesForMonth]);

  const dataToExcel = useMemo(() => {
    if (!data) return [];

    // 1. Define Columns
    const excelColumns = [
      { label: "Nombres", value: "nombres" },
      ...servicesForMonth.map((s) => ({
        label: `${s.date} - ${s.label}`,
        value: `${s.date}_${s.service}`,
      })),
      { label: "Total Mensual", value: "total" },
    ];

    // 2. Transform Data (Rows)
    const content = data.map((item) => {
      const row: any = {
        nombres: `${item.miembro.nombres} ${item.miembro.apellidos}`,
        total: item.diezmos.reduce((acc, curr) => acc + Number(curr.monto), 0),
      };

      servicesForMonth.forEach((service) => {
        const amount = item.diezmos
          .filter(
            (d) =>
              d.fecha_diezmo === service.date && d.servicio === service.service
          )
          .reduce((acc, curr) => acc + Number(curr.monto), 0);

        row[`${service.date}_${service.service}`] = amount || ""; // Use empty string for better visual if 0, or use 0 if calculations needed
      });

      return row;
    });

    // 3. Calculate Footer Totals
    const totalRow: any = {
      nombres: "TOTAL GENERAL",
      total: content.reduce((sum, row) => sum + (row.total || 0), 0),
    };

    servicesForMonth.forEach((service) => {
      const key = `${service.date}_${service.service}`;
      totalRow[key] = content.reduce((sum, row) => {
        const val = row[key];
        return sum + (typeof val === "number" ? val : 0);
      }, 0);
    });

    return [
      {
        sheet: "Diezmos",
        columns: excelColumns,
        content: [...content, totalRow],
      },
    ];
  }, [data, servicesForMonth]);

  return (
    <div>
      <SimpleCard
        title="Reporte de Diezmos Mensual"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => xlsx(dataToExcel)} variant="excel">
              Exportar a Excel <DownloadIcon />
            </Button>
            <Select
              value={String(year)}
              onValueChange={(value) => setYear(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(month)}
              onValueChange={(value) => setMonth(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Enero</SelectItem>
                <SelectItem value="2">Febrero</SelectItem>
                <SelectItem value="3">Marzo</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={data ?? []}
            mode="server"
            loading={isLoading || isFetching}
            error={isError ? error.message : undefined}
            onRetry={refetch}
          />
        </div>
      </SimpleCard>
    </div>
  );
};

export default DiezmosReportMensual;

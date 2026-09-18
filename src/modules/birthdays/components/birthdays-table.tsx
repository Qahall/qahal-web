import { useBirthdays } from "../hooks/useBirthdays";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MiembroResponse } from "@/modules/members/types/members.types";
import { UserIcon } from "lucide-react";
import { getMemberPhotoUrl } from "@/lib/supabase";

interface BirthdaysTableProps {
  month: number;
}

export const BirthdaysTable = ({ month }: BirthdaysTableProps) => {
  const { birthdays, isLoading, isError, error } = useBirthdays(month);

  const columns: ColumnDef<MiembroResponse>[] = [
    {
      accessorKey: "foto",
      header: "Foto",
      cell: ({ row }) => {
        const url = row.original.foto_url;
        return (
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-100 shadow-sm relative">
            {url ? (
              <img
                src={getMemberPhotoUrl(url)}
                alt={row.original.nombres}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent && parent.querySelector(".fallback-icon")) {
                    (
                      parent.querySelector(".fallback-icon") as HTMLElement
                    ).style.display = "block";
                  }
                }}
              />
            ) : null}
            <UserIcon
              className={`h-5 w-5 text-gray-400 absolute ${
                url ? "hidden fallback-icon" : ""
              }`}
            />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "nombres",
      header: "Miembro",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm capitalize">
            {row.original.nombres} {row.original.apellidos}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.email ?? ""}
          </span>
        </div>
      ),
    },
    {
      id: "cumpleanos",
      header: "Fecha Cumpleaños",
      cell: ({ row }) => {
        const dateStr = row.original.fecha_nacimiento;
        if (!dateStr) return "-";
        const [year, month, day] = dateStr.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return (
          <div className="font-medium text-sm">
            {day} de {date.toLocaleString("es-PE", { month: "long" })}
          </div>
        );
      },
    },
    {
      id: "edad_calculada",
      header: "Edad a cumplir",
      cell: ({ row }) => {
        const dateStr = row.original.fecha_nacimiento;
        if (!dateStr) return "-";
        const [year] = dateStr.split("-");
        const currentYear = new Date().getFullYear();
        const age = currentYear - Number(year);
        return (
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            {age} años
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={birthdays}
      mode="server"
      loading={isLoading}
      error={isError ? error?.message : undefined}
    />
  );
};

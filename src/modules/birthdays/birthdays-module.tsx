import { useState } from "react";
import { SimpleCard } from "@/components/simple-card";
import { BirthdaysTable } from "./components/birthdays-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const BirthdaysModule = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  return (
    <div className="p-6">
      <SimpleCard
        title="Reporte de Cumpleaños"
        description="Lista de miembros que cumplen años en el mes seleccionado."
        actions={
          <Select
            value={currentMonth.toString()}
            onValueChange={(val) => setCurrentMonth(Number(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <BirthdaysTable month={currentMonth} />
      </SimpleCard>
    </div>
  );
};

export default BirthdaysModule;

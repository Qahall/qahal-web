import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//PARA ENVIAR EN STRING
export const formatDate = (date?: Date | string | null): string | null => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

//PARA RECIBIR EN DATE
export const parseLocalDate = (date: string) => {
  if (!date) return undefined;
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

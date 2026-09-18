import { useQuery } from "@tanstack/react-query";
import { getReporteAnual, getReporteMensual } from "../actions/diezmos-report";

export function useReporteMensual(anio: number, mes: number) {
    return useQuery({
        queryKey: ["diezmos", "reporte", anio, mes],
        queryFn: () => getReporteMensual({ anio, mes }),
        staleTime: 1000 * 60 * 5,
    });
}

export function useReporteAnual(anio: number) {
    return useQuery({
        queryKey: ["diezmos", "reporte", anio],
        queryFn: () => getReporteAnual({ anio }),
        staleTime: 1000 * 60 * 5,
    });
}
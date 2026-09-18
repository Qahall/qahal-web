import { axiosInstance } from "@/lib/axios";
import { DiezmoReporteAnualResponse, DiezmoReporteMensualResponse } from "../types/diezmos-report";


const baseEndpoint = "diezmos/reporte";
export async function getReporteMensual({ anio, mes }: { anio: number, mes: number }) {
    const res = await axiosInstance.get<DiezmoReporteMensualResponse[]>(`${baseEndpoint}/${anio}/${mes}`);
    return res.data;
}

export async function getReporteAnual({ anio }: { anio: number }) {
    const res = await axiosInstance.get<DiezmoReporteAnualResponse[]>(`${baseEndpoint}/${anio}`);
    return res.data;
}

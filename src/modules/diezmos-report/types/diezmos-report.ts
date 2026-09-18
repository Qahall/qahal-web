import { MiembroResponse } from "@/modules/members/types/members.types";

interface DiezmoReporteMensual {
  fecha_diezmo: string;
  servicio: string;
  monto: string;
}

export interface DiezmoReporteAnual {
  monto_mes: string;
  mes_correspondiente: string;
}

export interface DiezmoReporteMensualResponse {
  miembro: MiembroResponse;
  diezmos: DiezmoReporteMensual[];
}

export interface DiezmoReporteAnualResponse {
  miembro: MiembroResponse;
  meses: DiezmoReporteAnual[];
}

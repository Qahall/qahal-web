import { MiembroResponse } from "@/modules/members/types/members.types";

// Enums
export enum ServicioEnum {
  AYMARA = "aymara",
  CENTRAL = "central",
  ADORACION = "adoracion",
  ORACION = "oracion",
}

export interface DiezmoBase {
  miembro_id: number;
  fecha_diezmo: string;
  // mes_correspondiente: string[];
  servicio?: string;
}

export interface DiezmoCreate extends DiezmoBase {
  monto: number;
  meses_correspondientes: {
    mes_correspondiente: string;
    monto_mes: number
  }[];
}

export interface DiezmoResponse extends DiezmoBase {
  id: number;
  monto: string;
  miembro: {
    nombres: string;
    apellidos: string;
  };
  meses_diezmo: {
    mes_correspondiente: string;
    monto_mes: string
  }[]
}

// Reporte Anual
export interface DiezmoReporteAnualBase {
  monto: number;
  mes_correspondiente: string[]; // list[str]
}

export interface DiezmoReporteAnualResponse {
  miembro: MiembroResponse;
  diezmos: DiezmoReporteAnualBase[];
}

// Reporte Mensual
export interface DiezmoReporteMensualBase {
  fecha_diezmo: string; // date → ISO
  servicio: ServicioEnum;
  monto: number;
}

export interface DiezmoReporteMensualResponse {
  miembro: MiembroResponse;
  diezmos: DiezmoReporteMensualBase[];
}

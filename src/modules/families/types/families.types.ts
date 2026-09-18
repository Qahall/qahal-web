import { MiembroResponse } from "@/modules/members/types/members.types";

export interface FamiliaMiembroBase {
  miembro_id: number;
  rol?: string | null;
  familia_id?: number | null;
}

export interface FamiliaMiembroCreate extends FamiliaMiembroBase {}

export interface FamiliaMiembroUpdate {
  rol?: string | null;
}

export interface FamiliaMiembroResponse {
  miembro_id: number;
  rol?: string | null;
  familia_id: number;
  miembro?: MiembroResponse | null;
}

export interface FamiliaBase {
  apellidos: string;
  fecha_matrimonio?: string | null; // FastAPI envia date como string
  lugar_matrimonio?: string | null;
}

export interface FamiliaCreate extends FamiliaBase {
  miembros: FamiliaMiembroCreate[];
}
export interface FamiliaResponse extends FamiliaBase {
  id: number;
  miembros_asociados: FamiliaMiembroResponse[];
}

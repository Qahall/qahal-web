import {
  CargoEnum,
  EstadoCivilEnum,
  NivelEducacionEnum,
  SexoEnum,
} from "./enums";

export interface MiembroBase {
  nombres: string;
  apellidos: string;
  dni: string;
  sexo: SexoEnum;
  fecha_nacimiento?: string | null;

  pais_nacimiento?: string | null;
  ciudad_nacimiento?: string | null;
  provincia_nacimiento?: string | null;
  distrito_nacimiento?: string | null;

  zona_id?: number | null;
  domicilio?: string | null;
  celular?: string | null;
  email?: string | null;

  foto_url?: string | null;

  tipo_miembro_id?: number | null;
  grado_instruccion?: NivelEducacionEnum | null;
  profesion?: string | null;
  ocupacion_actual?: string | null;

  estado_civil?: EstadoCivilEnum | null;
  tiene_hijos?: boolean;

  fecha_conversion?: string | null;
  iglesia_conversion?: string | null;
  lugar_conversion?: string | null;

  fecha_bautismo_espiritu?: string | null;
  iglesia_bautismo_espiritu?: string | null;
  lugar_bautismo_espiritu?: string | null;

  fecha_transferencia?: string | null;
  iglesia_transferencia?: string | null;
  lugar_transferencia?: string | null;

  es_miembro_externo: boolean;
}

export interface MiembroCreate extends MiembroBase {
  cursos: CursoMiembroCreate[];
  cargos: CargoMiembroCreate[];
  ministerios: MinisterioMiembroCreate[];

  bautizo?: BautizoMiembroCreate | null;
}

export interface MiembroResponse extends MiembroBase {
  id: number;
  codigo?: string | null;

  cursos: CursoMiembroResponse[];
  cargos: CargoMiembroResponse[];
  bautizo?: BautizoResponse | null;
  ministerios: MinisterioMiembroResponse[];
}

//CURSOS
export interface CursoMiembroCreate {
  curso_id: number;
  fecha_culminacion: string;
}

export interface CursoMiembroResponse {
  id: number;
  curso_id: number;
  fecha_culminacion: string;
  nombre: string;
}

//CARGOS
export interface CargoMiembroCreate {
  cargo_id: number;
}

export interface CargoMiembroResponse {
  id: number;
  cargo_id: number;
  nombre: string;
}

//MINISTERIOS
export interface MinisterioMiembroBase {
  ministerio_id: number;
  cargo: CargoEnum;
}

export interface MinisterioMiembroCreate extends MinisterioMiembroBase { }

export interface MinisterioMiembroResponse extends MinisterioMiembroBase {
  id: number;
  nombre: string;
}

//BAUTIZO
export interface BautizoMiembroCreate {
  fecha_bautizo?: string | null;
  iglesia_bautizo?: string | null;
  lugar_bautizo?: string | null;
}
export interface BautizoResponse {
  id: number;
  fecha_bautizo?: string | null;
  iglesia_bautizo?: string | null;
  lugar_bautizo?: string | null;
}

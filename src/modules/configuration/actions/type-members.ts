import { axiosInstance } from "@/lib/axios";

export interface TipoMiembroBase {
  nombre: string;
}
export interface TipoMiembroCreate extends TipoMiembroBase { }
export interface TipoMiembroResponse extends TipoMiembroBase {
  id: number;
}

const baseEndpoint = "tipo_miembros";

export async function getTypesMember(): Promise<TipoMiembroResponse[]> {
  const res = await axiosInstance.get<TipoMiembroResponse[]>(baseEndpoint);
  return res.data;
}

export async function createTypeMember(
  data: TipoMiembroCreate
): Promise<TipoMiembroResponse> {
  const res = await axiosInstance.post<TipoMiembroResponse>(baseEndpoint, data);
  return res.data;
}

export async function updateTypeMember({
  data,
  id,
}: {
  data: TipoMiembroCreate;
  id: number;
}): Promise<TipoMiembroResponse> {
  const res = await axiosInstance.put<TipoMiembroResponse>(
    `${baseEndpoint}/${id}`,
    data
  );
  return res.data;
}

export async function deleteTypeMember(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

// import { typesMemberHttp } from "./configuration.http";
// import { typesMemberMock } from "./configuration.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const typesMemberService = IS_DEMO ? typesMemberMock : typesMemberHttp;

// export const { getTypesMember, createTypeMember, updateTypeMember } =
//   typesMemberService;

import { axiosInstance } from "@/lib/axios";
import { GetArgs } from "@/types/api-args";
import { MiembroCreate, MiembroResponse } from "../types/members.types";
import { Paginated } from "@/types/paginated-data";

const baseEndpoint = "miembros";

export async function getMembersPaginated(
  args: GetArgs
): Promise<Paginated<MiembroResponse>> {
  const {
    page = 1,
    page_size = 5,
    order_by = "nombres",
    order_dir = "asc",
    filters,
  } = args;

  const res = await axiosInstance.get<Paginated<MiembroResponse>>(baseEndpoint, {
    params: {
      page,
      page_size,
      order_by,
      order_dir,
      ...filters,
    },
  });

  return res.data;
}

export async function getMembers(withExternalMembers = false): Promise<MiembroResponse[]> {
  const res = await axiosInstance.get<MiembroResponse[]>(baseEndpoint, {
    params: {
      es_miembro_externo: withExternalMembers ? undefined : false,
    },
  });
  return res.data;
}

export async function getMemberById(id: number): Promise<MiembroResponse> {
  const res = await axiosInstance.get<MiembroResponse>(`${baseEndpoint}/${id}`);
  return res.data;
}

export async function createMember(data: MiembroCreate) {
  const res = await axiosInstance.post(`${baseEndpoint}`, data);
  return res.data;
}

export async function updateMember({
  data,
  id,
}: {
  data: MiembroCreate;
  id: number;
}) {
  const res = await axiosInstance.put(`${baseEndpoint}/${id}`, data);
  return res.data;
}

export async function deleteMember(id: number) {
  const res = await axiosInstance.delete(`${baseEndpoint}/${id}`);
  return res.data;
}

export async function assignCodes(tipoMiembroId: number) {
  const res = await axiosInstance.post(`${baseEndpoint}/asignar-codigos/${tipoMiembroId}`);
  return res.data;
}

export async function assignCodeMember(memberId: number) {
  const res = await axiosInstance.post(`${baseEndpoint}/asignar-codigo-miembro/${memberId}`);
  return res.data;
}

// members/members.provider.ts
// import { membersHttp } from "./members.http";
// import { membersMock } from "./members.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const membersService = IS_DEMO ? membersMock : membersHttp;

// export const {
//   getMembers,
//   getMembersPaginated,
//   getMemberById,
//   createMember,
//   updateMember,
// } = membersService

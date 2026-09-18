import { GetArgs } from "@/types/api-args";
import { FamiliaCreate, FamiliaResponse } from "../types/families.types";
import { axiosInstance } from "@/lib/axios";
import { Paginated } from "@/types/paginated-data";

const baseEndpoint = "familias";

export async function getFamiliesPaginated(
  args: GetArgs
): Promise<Paginated<FamiliaResponse>> {
  const {
    page = 1,
    page_size = 5,
    order_by = "nombres",
    order_dir = "asc",
    filters,
  } = args;

  const res = await axiosInstance.get<Paginated<FamiliaResponse>>(baseEndpoint, {
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

export async function getFamilyById(id: number): Promise<FamiliaResponse> {
  const res = await axiosInstance.get<FamiliaResponse>(`${baseEndpoint}/${id}`);
  return res.data;
}
export async function createFamily(data: FamiliaCreate) {
  const res = await axiosInstance.post(`${baseEndpoint}`, data);
  return res.data;
}

export async function updateFamily({
  data,
  id,
}: {
  data: FamiliaCreate;
  id: number;
}) {
  const res = await axiosInstance.put(`${baseEndpoint}/${id}`, data);
  return res.data;
}

export async function deleteFamily(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}


// import { familiesHttp } from "./families.http"
// import { familiesMock } from "./families.mock"

// const IS_DEMO = import.meta.env.VITE_DEMO === "true"

// export const familiesService = IS_DEMO
//   ? familiesMock
//   : familiesHttp

// export const {
//   getFamiliesPaginated,
//   getFamilyById,
//   createFamily,
//   updateFamily,
// } = familiesService

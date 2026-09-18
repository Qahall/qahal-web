import { GetArgs } from "@/types/api-args";
import { DiezmoCreate, DiezmoResponse } from "../types/diezmos.types";
import { axiosInstance } from "@/lib/axios";
import { Paginated } from "@/types/paginated-data";

const baseEndpoint = "diezmos";

export async function getDiezmosPaginated(
  args: GetArgs
): Promise<Paginated<DiezmoResponse>> {
  const {
    page = 1,
    page_size = 5,
    order_by = "nombres",
    order_dir = "asc",
    filters,
  } = args;

  const res = await axiosInstance.get<Paginated<DiezmoResponse>>(baseEndpoint, {
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

export async function getDiezmosById(id: number): Promise<DiezmoResponse> {
  const res = await axiosInstance.get<DiezmoResponse>(`${baseEndpoint}/${id}`);
  return res.data;
}
export async function createDiezmo(data: DiezmoCreate) {
  const res = await axiosInstance.post(`${baseEndpoint}`, data);
  return res.data;
}

export async function updateDiezmo({
  data,
  id,
}: {
  data: DiezmoCreate;
  id: number;
}) {
  const res = await axiosInstance.put(`${baseEndpoint}/${id}`, data);
  return res.data;
}

export async function deleteDiezmo(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}


// import { diezmosMock } from "./diezmos.mock"
// import { diezmosHttp } from "./diezmos.http"

// const IS_DEMO = import.meta.env.VITE_DEMO === "true"

// export const diezmosService = IS_DEMO ? diezmosMock : diezmosHttp

// export const {
//   getDiezmosPaginated,
//   getDiezmosById,
//   createDiezmo,
//   updateDiezmo,
// } = diezmosService

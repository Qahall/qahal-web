import { axiosInstance } from "@/lib/axios";

export interface MinisterioBase {
  nombre: string;
}

export interface MinisterioCreate extends MinisterioBase { }

export interface MinisterioResponse extends MinisterioBase {
  id: number;
}

const baseEndpoint = "ministerios";
export async function getMinistries(): Promise<MinisterioResponse[]> {
  const res = await axiosInstance.get<MinisterioResponse[]>(baseEndpoint);
  return res.data;
}

export async function createMinistry(
  data: MinisterioCreate
): Promise<MinisterioResponse> {
  const res = await axiosInstance.post<MinisterioResponse>(baseEndpoint, data);
  return res.data;
}

export async function updateMinistry({
  data,
  id,
}: {
  data: MinisterioCreate;
  id: number;
}): Promise<MinisterioResponse> {
  const res = await axiosInstance.put<MinisterioResponse>(
    `${baseEndpoint}/${id}`,
    data
  );
  return res.data;
}

export async function deleteMinistry(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

// import { ministriesHttp } from "./configuration.http";
// import { ministriesMock } from "./configuration.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const ministriesService = IS_DEMO ? ministriesMock : ministriesHttp;

// export const { getMinistries, createMinistry, updateMinistry } =
//   ministriesService;

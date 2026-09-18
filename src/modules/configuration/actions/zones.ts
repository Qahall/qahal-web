import { axiosInstance } from "@/lib/axios";

export interface ZonaBase {
  nombre: string;
}
export interface ZonaCreate extends ZonaBase { }
export interface ZonaResponse extends ZonaBase {
  id: number;
}

const baseEndpoint = "zonas";

export async function getZones(): Promise<ZonaResponse[]> {
  const res = await axiosInstance.get<ZonaResponse[]>(baseEndpoint);
  return res.data;
}

export async function createZone(
  data: ZonaCreate
): Promise<ZonaResponse> {
  const res = await axiosInstance.post<ZonaResponse>(baseEndpoint, data);
  return res.data;
}

export async function updateZone({
  data,
  id,
}: {
  data: ZonaCreate;
  id: number;
}): Promise<ZonaResponse> {
  const res = await axiosInstance.put<ZonaResponse>(
    `${baseEndpoint}/${id}`,
    data
  );
  return res.data;
}

export async function deleteZone(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

// import { zonesHttp } from "./configuration.http";
// import { zonesMock } from "./configuration.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const zonesService = IS_DEMO ? zonesMock : zonesHttp;

// export const { getZones, createZone, updateZone } = zonesService;

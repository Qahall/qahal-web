import { axiosInstance } from "@/lib/axios";

export interface ChargeBase {
  nombre: string;
}

export interface ChargeCreate extends ChargeBase { }

export interface ChargeResponse extends ChargeBase {
  id: number;
}

const baseEndpoint = "cargos";
export async function getCharges(): Promise<ChargeResponse[]> {
  const res = await axiosInstance.get<ChargeResponse[]>(baseEndpoint);
  return res.data;
}

export async function createCharge(
  data: ChargeCreate
): Promise<ChargeResponse> {
  const res = await axiosInstance.post<ChargeResponse>(baseEndpoint, data);
  return res.data;
}

export async function updateCharge({
  data,
  id,
}: {
  data: ChargeCreate;
  id: number;
}): Promise<ChargeResponse> {
  const res = await axiosInstance.put<ChargeResponse>(
    `${baseEndpoint}/${id}`,
    data
  );
  return res.data;
}

export async function deleteCharge(id: number): Promise<void> {
  await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

// import { chargesHttp } from "./configuration.http";
// import { chargesMock } from "./configuration.mock";

// const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// export const chargesService = IS_DEMO ? chargesMock : chargesHttp;

// export const { getCharges, createCharge, updateCharge } = chargesService;

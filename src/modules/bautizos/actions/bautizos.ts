import { GetArgs } from "@/types/api-args";
import { BautizoCreate, BautizoResponse } from "../types/bautizos";
import { axiosInstance } from "@/lib/axios";
import { Paginated } from "@/types/paginated-data";

const baseEndpoint = "bautizos";

export async function getBautizosPaginated(
    args: GetArgs
): Promise<Paginated<BautizoResponse>> {
    const {
        page,
        page_size
    } = args;

    const res = await axiosInstance.get<Paginated<BautizoResponse>>(baseEndpoint, {
        params: {
            page,
            page_size,
        },
    });

    return res.data;
}

export async function getBautizoById(id: number): Promise<BautizoResponse> {
    const res = await axiosInstance.get<BautizoResponse>(`${baseEndpoint}/${id}`);
    return res.data;
}

export async function createBautizo(data: BautizoCreate) {
    const res = await axiosInstance.post(`${baseEndpoint}`, data);
    return res.data;
}

export async function updateBautizo({
    data,
    id,
}: {
    data: BautizoCreate;
    id: number;
}) {
    const res = await axiosInstance.put(`${baseEndpoint}/${id}`, data);
    return res.data;
}

export async function deleteBautizo(id: number): Promise<void> {
    await axiosInstance.delete(`${baseEndpoint}/${id}`);
}

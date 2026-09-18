import { useQuery } from "@tanstack/react-query";
import { GetArgs } from "@/types/api-args";
import { getBautizoById, getBautizosPaginated } from "../actions/bautizos";

export function useBautizosPaginated(params: GetArgs) {
    const { page, page_size } = params;

    return useQuery({
        queryKey: ["bautizos", page, page_size],

        queryFn: () =>
            getBautizosPaginated({
                page,
                page_size,
            }),
        staleTime: 1000 * 10, // 10 segundos
        retry: 1,
    });
}

export function useBautizoById(id?: number) {
    return useQuery({
        queryKey: ["bautizo-get-by-id", id],
        queryFn: () => getBautizoById(id!),
        staleTime: 1000 * 60 * 5, // 5 mins cache
        enabled: !!id,
    });
}

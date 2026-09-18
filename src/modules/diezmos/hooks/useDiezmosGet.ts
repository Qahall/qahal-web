import { useQuery } from "@tanstack/react-query";
import { GetArgs } from "@/types/api-args";
import { getDiezmosById, getDiezmosPaginated } from "../actions/diezmos";

export function useDiezmosPaginated(params: GetArgs) {
  const { page, page_size, order_by, order_dir, filters } = params;

  return useQuery({
    queryKey: ["diezmos", page, page_size, order_by, order_dir, filters],

    queryFn: () =>
      getDiezmosPaginated({
        page,
        page_size,
        order_by,
        order_dir,
        filters: filters ?? undefined,
      }),
    staleTime: 1000 * 10, // 10 segundos
    retry: 1,
  });
}

export function useDiezmoById(id?: number) {
  return useQuery({
    queryKey: ["diezmo-get-by-id", id],
    queryFn: () => getDiezmosById(id!),
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
    enabled: !!id,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getFamiliesPaginated, getFamilyById } from "../actions/families";
import { GetArgs } from "@/types/api-args";

export function useFamiliesPaginated(params: GetArgs) {
  const { page, page_size, order_by, order_dir, filters } = params;

  return useQuery({
    queryKey: ["families", page, page_size, order_by, order_dir, filters],

    queryFn: () =>
      getFamiliesPaginated({
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

export function useFamilyById(id?: number) {
  return useQuery({
    queryKey: ["family-get-by-id", id],
    queryFn: () => getFamilyById(id!),
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
    enabled: !!id,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getMemberById, getMembers, getMembersPaginated } from "../actions/members";
import { GetArgs } from "@/types/api-args";

export function useMembersPaginated(params: GetArgs) {
  const { page, page_size, order_by, order_dir, filters } = params;

  return useQuery({
    queryKey: ["members", page, page_size, order_by, order_dir, filters],

    queryFn: () =>
      getMembersPaginated({
        page,
        page_size,
        order_by,
        order_dir,
        filters: filters ?? undefined,
      }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useMembers(withExternalMembers = false) {
  return useQuery({
    queryKey: ["members-get", withExternalMembers],
    queryFn: () => getMembers(withExternalMembers),
    staleTime: 1000 * 60 * 5, //5 min
  });
}


export function useMemberById(id?: number) {
  return useQuery({
    queryKey: ["member-get-by-id", id],
    queryFn: () => getMemberById(id!),
    staleTime: 1000 * 60 * 5, //5 min
    enabled: !!id
  })
}
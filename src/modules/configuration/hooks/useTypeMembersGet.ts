import { useQuery } from "@tanstack/react-query";
import { getTypesMember } from "../actions/type-members";

export function useTypeMembers() {
  return useQuery({
    queryKey: ["types-member"],
    queryFn: getTypesMember,
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
  });
}

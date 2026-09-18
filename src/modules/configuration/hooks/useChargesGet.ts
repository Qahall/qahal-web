import { useQuery } from "@tanstack/react-query";
import { getCharges } from "../actions/charges";

export function useCharges() {
  return useQuery({
    queryKey: ["charges"],
    queryFn: getCharges,
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
  });
}

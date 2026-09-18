import { useQuery } from "@tanstack/react-query";
import { getZones } from "../actions/zones";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
  });
}

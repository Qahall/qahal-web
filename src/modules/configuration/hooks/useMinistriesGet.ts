import { useQuery } from "@tanstack/react-query";
import { getMinistries } from "../actions/ministries";

export function useMinistries() {
  return useQuery({
    queryKey: ["ministries"],
    queryFn: getMinistries,
    staleTime: 1000 * 60 * 5, // 5 mins cache (ideal para listas)
  });
}

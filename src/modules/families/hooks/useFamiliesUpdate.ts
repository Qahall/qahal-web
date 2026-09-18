import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFamily } from "../actions/families";

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "families"],
    mutationFn: updateFamily,
    onSuccess: (_data, variables) => {
      const id = variables.id;
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["family-get-by-id", id] });
    },
  });
};

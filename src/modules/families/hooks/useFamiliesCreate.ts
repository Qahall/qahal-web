import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFamily } from "../actions/families";

export const useCreateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "families"],
    mutationFn: createFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
};

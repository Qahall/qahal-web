import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiezmo } from "../actions/diezmos";

export const useCreateDiezmo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "diezmos"],
    mutationFn: createDiezmo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diezmos"] });
    },
  });
};

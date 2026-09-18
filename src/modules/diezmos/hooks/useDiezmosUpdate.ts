import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDiezmo } from "../actions/diezmos";

export const useUpdateDiezmo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "diezmos"],
    mutationFn: updateDiezmo,
    onSuccess: (_data, variables) => {
      const id = variables.id;
      queryClient.invalidateQueries({ queryKey: ["diezmos"] });
      queryClient.invalidateQueries({ queryKey: ["diezmo-get-by-id", id] });
    },
  });
};

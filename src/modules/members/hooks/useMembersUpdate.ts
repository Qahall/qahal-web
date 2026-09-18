import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMember } from "../actions/members";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "members"],
    mutationFn: updateMember,
    onSuccess: (_data, variables) => {
      const id = variables.id;
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member-get-by-id", id] });
      queryClient.invalidateQueries({ queryKey: ["bautizo-get-by-id", id] });
    },
  });
};

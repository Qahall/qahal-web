import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMember } from "../actions/members"

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "members"],
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
      queryClient.invalidateQueries({ queryKey: ["members-get"] })
    }
  })
}
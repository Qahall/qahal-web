import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignCodeMember, assignCodes } from "../actions/members";

export const useAssignCodes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["assign-codes", "members"],
    mutationFn: assignCodes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
    }
  })
}

export const useAssignCodeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["assign-code-member", "members"],
    mutationFn: assignCodeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] })
    }
  })
}

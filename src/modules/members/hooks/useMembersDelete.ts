import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "../actions/members";

export const useDeleteMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["members"],
            });
        },
    })
};

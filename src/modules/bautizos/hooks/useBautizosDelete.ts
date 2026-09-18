import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBautizo } from "../actions/bautizos";

export const useDeleteBautizo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBautizo,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bautizos"],
            });
        },
    })
};

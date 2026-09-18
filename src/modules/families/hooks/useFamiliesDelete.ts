import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFamily } from "../actions/families";

export const useDeleteFamily = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFamily,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["families"],
            });
        },
    })
};

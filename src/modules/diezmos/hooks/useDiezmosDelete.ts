import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiezmo } from "../actions/diezmos";

export const useDeleteDiezmo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDiezmo,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["diezmos"],
            });
        },
    })
};

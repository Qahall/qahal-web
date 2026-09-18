import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBautizo } from "../actions/bautizos";

export const useUpdateBautizo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update", "bautizos"],
        mutationFn: updateBautizo,
        onSuccess: (_data, variables) => {
            const id = variables.id;
            queryClient.invalidateQueries({ queryKey: ["bautizos"] });
            queryClient.invalidateQueries({ queryKey: ["bautizo-get-by-id", id] });
            queryClient.invalidateQueries({ queryKey: ["member-get-by-id", id] });
        },
    });
};

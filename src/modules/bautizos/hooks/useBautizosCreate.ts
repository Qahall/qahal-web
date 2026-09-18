import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBautizo } from "../actions/bautizos";

export const useCreateBautizo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create", "bautizos"],
        mutationFn: createBautizo,
        onSuccess: (_data, variables) => {
            const id = variables.miembro_id;
            queryClient.invalidateQueries({ queryKey: ["bautizos"] });
            queryClient.invalidateQueries({ queryKey: ["member-get-by-id", id] });
        },
    });
};

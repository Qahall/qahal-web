import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCharge } from "../actions/charges";
import { deleteZone } from "../actions/zones";
import { deleteTypeMember } from "../actions/type-members";
import { deleteMinistry } from "../actions/ministries";
import { deleteCourse } from "../actions/courses";

export const useDeleteCharge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCharge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["charges"] });
        },
    });
};

export const useDeleteZone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteZone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["zones"] });
        },
    });
};

export const useDeleteTypeMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTypeMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types-member"] });
        },
    });
};

export const useDeleteMinistry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMinistry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ministries"] });
        },
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};

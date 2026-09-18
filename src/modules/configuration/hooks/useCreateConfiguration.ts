import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCharge } from "../actions/charges";
import { createZone } from "../actions/zones";
import { createTypeMember } from "../actions/type-members";
import { createMinistry } from "../actions/ministries";
import { createCourse } from "../actions/courses";

export const useCreateCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "charges"],
    mutationFn: createCharge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "zones"],
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

export const useCreateTypeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "types-member"],
    mutationFn: createTypeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types-member"] });
    },
  });
};

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "ministries"],
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create", "courses"],
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

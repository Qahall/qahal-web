import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCharge } from "../actions/charges";
import { updateCourse } from "../actions/courses";
import { updateMinistry } from "../actions/ministries";
import { updateTypeMember } from "../actions/type-members";
import { updateZone } from "../actions/zones";

export const useUpdateCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "charges"],
    mutationFn: updateCharge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "courses"],
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "ministries"],
    mutationFn: updateMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useUpdateTypeMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "types-member"],
    mutationFn: updateTypeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types-member"] });
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update", "zones"],
    mutationFn: updateZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
};

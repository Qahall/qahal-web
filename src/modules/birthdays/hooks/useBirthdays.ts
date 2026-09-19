
import { useQuery } from "@tanstack/react-query";
import { getBirthdays } from "@/modules/members/actions/members";

export const useBirthdays = (month: number) => {
    const { data: members, isLoading, isError, error } = useQuery({
        queryKey: ["birthdays", month],
        queryFn: () => getBirthdays(month),
    });

    return {
        birthdays: members ?? [],
        isLoading,
        isError,
        error,
    };
};

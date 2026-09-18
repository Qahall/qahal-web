
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/modules/members/actions/members";
import { useMemo } from "react";

export const useBirthdays = (month: number) => {
    // Use a unique key to cache members data.
    // Since we are fetching ALL members, we can cache this heavily if needed, 
    // but for now we follow standard react-query defaults.
    const { data: members, isLoading, isError, error } = useQuery({
        queryKey: ["members", "all"],
        queryFn: () => getMembers(),
    });

    const birthdays = useMemo(() => {
        if (!members) return [];

        return members
            .filter((member) => {
                if (!member.fecha_nacimiento) return false;

                // Handle YYYY-MM-DD string
                // We split to avoid timezone offsets issues with Date() constructor on just dates
                const parts = member.fecha_nacimiento.split("-");
                if (parts.length < 3) return false;

                const memberMonth = parseInt(parts[1]); // 1-12
                return memberMonth === month;
            })
            .sort((a, b) => {
                // Sort by day of month
                const dayA = parseInt(a.fecha_nacimiento!.split("-")[2]);
                const dayB = parseInt(b.fecha_nacimiento!.split("-")[2]);
                return dayA - dayB;
            });
    }, [members, month]);

    return {
        birthdays,
        isLoading,
        isError,
        error,
    };
};

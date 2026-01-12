import { useQuery } from "@tanstack/react-query";
import { historyService } from "../services/history.service";

export function useUserInterviews(userId: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-interviews", userId],
    queryFn: () => historyService.getUserInterviews(userId!),
    enabled: !!userId,
  });

  return { data: data?.data, isLoading, error: error?.message };
}

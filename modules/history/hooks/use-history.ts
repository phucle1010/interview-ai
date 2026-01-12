import { useQuery } from "@tanstack/react-query";
import { historyService } from "../services/history.service";

export function useUserInterviews(userId: string | null) {
  return useQuery({
    queryKey: ["user-interviews", userId],
    queryFn: () => historyService.getUserInterviews(userId!),
    enabled: !!userId,
  });
}

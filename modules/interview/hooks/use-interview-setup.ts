import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { interviewService } from "@/modules/interview/services/interview.service";
import { CreateSetupRequest } from "@/modules/interview/schemas";

export function useInterviewSetups() {
  return useQuery({
    queryKey: ["interview-setups"],
    queryFn: () => interviewService.getSetups(),
  });
}

export function useInterviewSetup(setupId: string | null) {
  return useQuery({
    queryKey: ["interview-setup", setupId],
    queryFn: () => interviewService.getSetup(setupId!),
    enabled: !!setupId,
  });
}

export function useCreateInterviewSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateSetupRequest) =>
      interviewService.createSetup(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["interview-setups"] });
      router.push(`/interview?setupId=${response.id}`);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { interviewService } from "@/modules/interview/services/interview.service";
import {
  CreateSetupRequest,
  UpdateSetupRequest,
} from "@/modules/interview/schemas";

export function useInterviewSetups(options?: { includeTemplates?: boolean }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interview-setups", options],
    queryFn: () => interviewService.getSetups(options),
  });

  return { data: data?.data, isLoading, error: error?.message };
}

export function useInterviewSetup(setupId: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interview-setup", setupId],
    queryFn: () => interviewService.getSetup(setupId!),
    enabled: !!setupId,
  });

  return { data: data?.data, isLoading, error: error?.message };
}

export function useDefaultInterviewSetup() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interview-setup", "default"],
    queryFn: () => interviewService.getDefaultSetup(),
  });

  return { data: data?.data, isLoading, error: error?.message };
}

export function useCreateInterviewSetup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateSetupRequest) =>
      interviewService.createSetup(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["interview-setups"] });
      router.push(`/interview?setupId=${response.data?.id}`);
    },
  });
}

export function useUpdateInterviewSetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      setupId,
      data,
    }: {
      setupId: string;
      data: UpdateSetupRequest;
    }) => interviewService.updateSetup(setupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["interview-setups"] });
      queryClient.invalidateQueries({
        queryKey: ["interview-setup", variables.setupId],
      });
    },
  });
}

export function useDeleteInterviewSetup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setupId: string) => interviewService.deleteSetup(setupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-setups"] });
    },
  });
}

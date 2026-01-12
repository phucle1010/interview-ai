import { useMutation, useQuery } from "@tanstack/react-query";
import { voiceService } from "../services/voice.service";
import type {
  StartInterviewRequest,
  ProcessTranscriptRequest,
  EndInterviewRequest,
} from "../services/voice.service";

export function useStartInterview() {
  return useMutation({
    mutationFn: (data: StartInterviewRequest) => voiceService.start(data),
  });
}

export function useProcessTranscript() {
  return useMutation({
    mutationFn: (data: ProcessTranscriptRequest) => voiceService.process(data),
  });
}

export function useEndInterview() {
  return useMutation({
    mutationFn: (data: EndInterviewRequest) => voiceService.end(data),
  });
}

export function useSessionHistory(sessionId: string | null) {
  return useQuery({
    queryKey: ["session-history", sessionId],
    queryFn: () => voiceService.getSessionHistory(sessionId!),
    enabled: !!sessionId,
  });
}

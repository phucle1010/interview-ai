import { axiosInstance } from "@/lib/configs/axios";

export interface StartInterviewRequest {
  setupId: string;
}

export interface StartInterviewResponse {
  sessionId: string;
  question: string;
}

export interface ProcessTranscriptRequest {
  sessionId: string;
  transcript: string;
}

export interface ProcessTranscriptResponse {
  response: string;
  question?: string;
  isComplete: boolean;
}

export interface EndInterviewRequest {
  sessionId: string;
}

export interface EndInterviewResponse {
  score: number;
  feedback: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export const voiceService = {
  start: async (
    data: StartInterviewRequest
  ): Promise<StartInterviewResponse> => {
    const response = await axiosInstance.post<StartInterviewResponse>(
      "/voice/start",
      data
    );
    return response.data;
  },

  process: async (
    data: ProcessTranscriptRequest
  ): Promise<ProcessTranscriptResponse> => {
    const response = await axiosInstance.post<ProcessTranscriptResponse>(
      "/voice/process",
      data
    );
    return response.data;
  },

  end: async (data: EndInterviewRequest): Promise<EndInterviewResponse> => {
    const response = await axiosInstance.post<EndInterviewResponse>(
      "/voice/end",
      data
    );
    return response.data;
  },

  getSessionHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get<ChatMessage[]>(
      `/voice/histories/session/${sessionId}`
    );
    return response.data;
  },
};

import { axiosInstance } from "@/lib/configs/axios";

import {
  StartInterviewRequest,
  StartInterviewResponse,
  ProcessTranscriptRequest,
  ProcessTranscriptResponse,
  EndInterviewRequest,
  EndInterviewResponse,
  GetInterviewStatusResponse,
  ChatMessage,
  GetChatHistoriesResponse,
  GetChatHistoriesListResponse,
} from "@/modules/voice/schemas";

export const voiceService = {
  start: async (
    data: StartInterviewRequest
  ): Promise<StartInterviewResponse> => {
    const response = await axiosInstance.post<StartInterviewResponse>(
      "/voice/interview/start",
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
      "/voice/interview/end",
      data
    );
    return response.data;
  },

  getInterviewStatus: async (): Promise<GetInterviewStatusResponse> => {
    const response = await axiosInstance.get<GetInterviewStatusResponse>(
      "/voice/interview/status"
    );
    return response.data;
  },

  getSessionHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get<ChatMessage[]>(
      `/voice/histories/session/${sessionId}`
    );
    return response.data;
  },

  getChatHistories: async (
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<GetChatHistoriesResponse> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await axiosInstance.get<GetChatHistoriesResponse>(
      `/voice/history/${userId}${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  getChatHistory: async (options?: {
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetChatHistoriesResponse> => {
    const params = new URLSearchParams();
    if (options?.userId) params.append("userId", options.userId);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await axiosInstance.get<GetChatHistoriesResponse>(
      `/voice/history${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  getChatHistoriesList: async (options?: {
    limit?: number;
    offset?: number;
    sessionId?: string;
  }): Promise<GetChatHistoriesListResponse> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.sessionId) params.append("sessionId", options.sessionId);

    const response = await axiosInstance.get<GetChatHistoriesListResponse>(
      `/voice/histories${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  deleteChatHistory: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/voice/history/${userId}`);
  },
};

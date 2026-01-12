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
  GetSessionHistoryResponse,
} from "@/modules/voice/schemas";
import { HttpResponse } from "@/lib/types/http";

export const voiceService = {
  start: async (
    data: StartInterviewRequest
  ): Promise<HttpResponse<StartInterviewResponse>> => {
    const response = await axiosInstance.post("/voice/interview/start", data);
    return response.data;
  },

  process: async (
    data: ProcessTranscriptRequest
  ): Promise<HttpResponse<ProcessTranscriptResponse>> => {
    const response = await axiosInstance.post("/voice/process", data);
    return response.data;
  },

  end: async (
    data: EndInterviewRequest
  ): Promise<HttpResponse<EndInterviewResponse>> => {
    const response = await axiosInstance.post("/voice/interview/end", data);
    return response.data;
  },

  getInterviewStatus: async (): Promise<
    HttpResponse<GetInterviewStatusResponse>
  > => {
    const response = await axiosInstance.get("/voice/interview/status");
    return response.data;
  },

  getSessionHistory: async (
    sessionId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<HttpResponse<GetSessionHistoryResponse>> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await axiosInstance.get(
      `/voice/histories/session/${sessionId}${
        params.toString() ? `?${params.toString()}` : ""
      }`
    );
    return response.data;
  },

  getChatHistories: async (
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<HttpResponse<GetChatHistoriesResponse>> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await axiosInstance.get(
      `/voice/history/${userId}${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  getChatHistory: async (options?: {
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<HttpResponse<GetChatHistoriesResponse>> => {
    const params = new URLSearchParams();
    if (options?.userId) params.append("userId", options.userId);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const response = await axiosInstance.get(
      `/voice/history${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  getChatHistoriesList: async (options?: {
    limit?: number;
    offset?: number;
    sessionId?: string;
  }): Promise<HttpResponse<GetChatHistoriesResponse>> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.sessionId) params.append("sessionId", options.sessionId);

    const response = await axiosInstance.get(
      `/voice/histories${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  deleteChatHistory: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/voice/history/${userId}`);
  },
};

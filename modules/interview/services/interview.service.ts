import { axiosInstance } from "@/lib/configs/axios";
import { HttpResponse } from "@/lib/types/http";

import {
  CreateSetupRequest,
  UpdateSetupRequest,
  InterviewSetup,
  InterviewSetupResponse,
} from "@/modules/interview/schemas";

export const interviewService = {
  getSetups: async (options?: {
    includeTemplates?: boolean;
  }): Promise<HttpResponse<InterviewSetupResponse>> => {
    const params = new URLSearchParams();
    if (options?.includeTemplates) {
      params.append("includeTemplates", "true");
    }

    const response = await axiosInstance.get(
      `/interviews/setup${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  getSetup: async (setupId: string): Promise<HttpResponse<InterviewSetup>> => {
    const response = await axiosInstance.get(`/interviews/setup/${setupId}`);
    return response.data;
  },

  getDefaultSetup: async (): Promise<HttpResponse<InterviewSetup>> => {
    const response = await axiosInstance.get("/interviews/setup/default");
    return response.data;
  },

  createSetup: async (
    data: CreateSetupRequest
  ): Promise<HttpResponse<{ id: string }>> => {
    const response = await axiosInstance.post("/interviews/setup", data);
    return response.data;
  },

  updateSetup: async (
    setupId: string,
    data: UpdateSetupRequest
  ): Promise<HttpResponse<InterviewSetup>> => {
    const response = await axiosInstance.put(
      `/interviews/setup/${setupId}`,
      data
    );
    return response.data;
  },

  deleteSetup: async (setupId: string): Promise<HttpResponse<void>> => {
    const response = await axiosInstance.delete(`/interviews/setup/${setupId}`);
    return response.data;
  },
};

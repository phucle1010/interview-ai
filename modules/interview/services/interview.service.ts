import { axiosInstance } from "@/lib/configs/axios";
import { HttpResponse } from "@/lib/types/http";

import {
  CreateSetupRequest,
  InterviewSetup,
} from "@/modules/interview/schemas";

export const interviewService = {
  getSetups: async (): Promise<HttpResponse<InterviewSetup[]>> => {
    const response = await axiosInstance.get("/interviews/setup");
    return response.data;
  },

  getSetup: async (setupId: string): Promise<HttpResponse<InterviewSetup>> => {
    const response = await axiosInstance.get(`/interviews/setup/${setupId}`);
    return response.data;
  },

  createSetup: async (
    data: CreateSetupRequest
  ): Promise<HttpResponse<{ id: string }>> => {
    const response = await axiosInstance.post("/interviews/setup", data);
    return response.data;
  },
};

import { axiosInstance } from "@/lib/configs/axios";

import {
  CreateSetupRequest,
  InterviewSetup,
} from "@/modules/interview/schemas";

export const interviewService = {
  getSetups: async (): Promise<InterviewSetup[]> => {
    const response =
      await axiosInstance.get<InterviewSetup[]>("/interviews/setup");
    return response.data;
  },

  getSetup: async (setupId: string): Promise<InterviewSetup> => {
    const response = await axiosInstance.get<InterviewSetup>(
      `/interviews/setup/${setupId}`
    );
    return response.data;
  },

  createSetup: async (data: CreateSetupRequest): Promise<{ id: string }> => {
    const response = await axiosInstance.post<{ id: string }>(
      "/interviews/setup",
      data
    );
    return response.data;
  },
};

import { axiosInstance } from "@/lib/configs/axios";
import { HttpResponse } from "@/lib/types/http";

export interface InterviewSession {
  id: string;
  sessionId: string;
  jobRole: string;
  experienceLevel: string;
  language: string;
  score?: number;
  createdAt: string;
}

export const historyService = {
  getUserInterviews: async (
    userId: string
  ): Promise<HttpResponse<InterviewSession[]>> => {
    const response = await axiosInstance.get(`/interviews/user/${userId}`);
    return response.data;
  },
};

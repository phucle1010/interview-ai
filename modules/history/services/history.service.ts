import { axiosInstance } from "@/lib/configs/axios";

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
  getUserInterviews: async (userId: string): Promise<InterviewSession[]> => {
    const response = await axiosInstance.get<InterviewSession[]>(
      `/interviews/user/${userId}`
    );
    return response.data;
  },
};

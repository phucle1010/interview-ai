import { axiosInstance } from "@/lib/configs/axios";

import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "@/modules/auth/schemas";
import { User } from "@/lib/storages/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  },
};

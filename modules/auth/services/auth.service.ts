import { axiosInstance } from "@/lib/configs/axios";

import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "@/modules/auth/schemas";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      data
    );
    return response.data;
  },
};

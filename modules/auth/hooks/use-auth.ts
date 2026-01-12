import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authService } from "@/modules/auth/services/auth.service";
import { LoginRequest, SignupRequest } from "@/modules/auth/schemas";

import { auth } from "@/lib/storages/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLogin() {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (response) => {
      auth.setToken(response.token);
      // Fetch user from API after login
      await fetchUser();
      router.push("/dashboard");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: async (response) => {
      auth.setToken(response.token);
      // Fetch user from API after signup
      await fetchUser();
      router.push("/dashboard");
    },
  });
}

export function useGetMe() {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    enabled: auth.isAuthenticated(),
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      // If getMe fails, user might not be authenticated
      setUser(null);
    }
  }, [query.data, query.isError, setUser]);

  return query;
}

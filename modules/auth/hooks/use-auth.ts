import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/modules/auth/services/auth.service";
import { LoginRequest, SignupRequest } from "@/modules/auth/schemas";

import { auth } from "@/lib/storages/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      auth.setToken(response.token);
      auth.setUser(response.user);
      setUser(response.user);
      router.push("/dashboard");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: (response) => {
      auth.setToken(response.token);
      auth.setUser(response.user);
      setUser(response.user);
      router.push("/dashboard");
    },
  });
}

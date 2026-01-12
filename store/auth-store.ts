import { create } from "zustand";
import { auth, type User } from "@/lib/storages/auth";
import { authService } from "@/modules/auth/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: auth.isAuthenticated(),
  isLoading: false,
  setUser: (user) => {
    set({ user, isAuthenticated: auth.isAuthenticated() });
  },
  logout: () => {
    auth.logout();
    set({ user: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    if (!auth.isAuthenticated()) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // If fetch fails, clear auth state
      set({ user: null, isAuthenticated: false, isLoading: false });
      auth.logout();
    }
  },
  initialize: () => {
    // Initialize auth state based on token
    const hasToken = auth.isAuthenticated();
    set({ isAuthenticated: hasToken });

    // If token exists, fetch user
    if (hasToken) {
      get().fetchUser();
    }
  },
}));

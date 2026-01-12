import { create } from "zustand";
import { auth, type User } from "@/lib/storages/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      auth.setUser(user);
    } else {
      auth.removeUser();
    }
  },
  logout: () => {
    auth.logout();
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const user = auth.getUser();
    const isAuthenticated = auth.isAuthenticated();
    set({ user, isAuthenticated });
  },
}));

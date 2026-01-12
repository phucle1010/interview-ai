"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useGetMe } from "@/modules/auth/hooks/use-auth";
import { Navbar } from "./Navbar";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  const { isAuthenticated, initialize } = useAuthStore();
  useGetMe(); // This will automatically fetch user if authenticated

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  // Don't show navbar on auth pages
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthPage) {
    return null;
  }

  // Show authenticated navbar if logged in, otherwise show landing navbar
  return isAuthenticated ? <Navbar /> : <LandingNavbar />;
}

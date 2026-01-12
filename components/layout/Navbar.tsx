"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useGetMe } from "@/modules/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, History, LogOut } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated, initialize } = useAuthStore();
  useGetMe(); // This will automatically fetch user if authenticated

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl slide-in-up">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold gradient-text transition-all hover:scale-105"
        >
          Interview AI
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent/50 transition-all duration-200"
            >
              <LayoutDashboard className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Dashboard
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent/50 transition-all duration-200"
            >
              <History className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              History
            </Button>
          </Link>
          <div className="mx-2 h-6 w-px bg-border transition-opacity" />
          <div className="text-sm font-medium text-muted-foreground fade-in">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4 transition-transform hover:rotate-12" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

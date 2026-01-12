import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview AI - Authentication",
  description: "Login or sign up to Interview AI",
};

// Auth layout without navbar
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

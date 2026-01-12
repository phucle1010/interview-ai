import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Interview AI",
  description: "Login to your Interview AI account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

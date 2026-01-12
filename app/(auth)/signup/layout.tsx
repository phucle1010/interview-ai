import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Interview AI",
  description: "Create a new Interview AI account",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

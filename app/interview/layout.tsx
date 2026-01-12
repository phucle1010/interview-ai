import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview - Interview AI",
  description: "AI-powered interview session",
};

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

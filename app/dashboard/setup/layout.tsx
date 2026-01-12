import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Setup - Interview AI",
  description: "Configure your interview setup",
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

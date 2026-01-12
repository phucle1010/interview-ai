import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Interview AI",
  description: "Manage your interview setups and start new interviews",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

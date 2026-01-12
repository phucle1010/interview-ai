import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - Interview AI",
  description: "View your interview history and session details",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

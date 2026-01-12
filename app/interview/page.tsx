"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InterviewRoom } from "@/modules/interview/components/InterviewRoom";

function InterviewLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading interview...</p>
      </div>
    </div>
  );
}

function InterviewContent() {
  const searchParams = useSearchParams();
  const setupId = searchParams.get("setupId");

  if (!setupId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No setup ID provided</p>
        </div>
      </div>
    );
  }

  return <InterviewRoom setupId={setupId} />;
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewContent />
    </Suspense>
  );
}

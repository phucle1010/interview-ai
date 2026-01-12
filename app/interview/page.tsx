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
  const role = searchParams.get("role");
  const level = searchParams.get("level");
  const focusAreas = searchParams.get("focusAreas");
  const language = searchParams.get("language");
  const maxQuestions = searchParams.get("maxQuestions");

  if (
    !setupId ||
    !role ||
    !level ||
    !focusAreas ||
    !language ||
    !maxQuestions
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No setup ID provided</p>
        </div>
      </div>
    );
  }

  return (
    <InterviewRoom
      setupId={setupId}
      role={role}
      level={level}
      focusAreas={focusAreas ? focusAreas.split(",") : []}
      language={language}
      maxQuestions={maxQuestions ? parseInt(maxQuestions) : 10}
    />
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewContent />
    </Suspense>
  );
}

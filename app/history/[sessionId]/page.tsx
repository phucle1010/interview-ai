"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SessionDetail } from "@/modules/history/components/SessionDetail";

function SessionDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="mb-4 h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-auto max-w-4xl">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

function SessionDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const score = searchParams.get("score")
    ? Number(searchParams.get("score"))
    : undefined;

  return <SessionDetail sessionId={sessionId} score={score} />;
}

export default function SessionDetailPage() {
  return (
    <Suspense fallback={<SessionDetailLoading />}>
      <SessionDetailContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import { SetupForm } from "@/modules/interview/components/SetupForm";

function SetupLoading() {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="h-96 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<SetupLoading />}>
      <div className="container mx-auto max-w-2xl p-6">
        <SetupForm />
      </div>
    </Suspense>
  );
}

import { Suspense } from "react";
import { HistoryList } from "@/modules/history/components/HistoryList";

function HistoryLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryList />
    </Suspense>
  );
}

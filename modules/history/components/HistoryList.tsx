"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useChatHistoriesListInfinite } from "@/modules/voice/hooks/use-voice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Loader2, MessagesSquare } from "lucide-react";

export function HistoryList() {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChatHistoriesListInfinite();

  const histories = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data?.histories || []);
  }, [data]);

  console.info("histories", histories);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2 fade-in">
          Interview History
        </h1>
        <p
          className="text-muted-foreground fade-in"
          style={{ animationDelay: "100ms" }}
        >
          View your past interview sessions
        </p>
      </div>

      {isError && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load histories"}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : histories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              No interview sessions yet
            </p>
            <Link href="/dashboard">
              <Button>Start Your First Interview</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {histories.map((history, index) => (
            <Card
              key={`${history.sessionId}-${index}`}
              className="glass group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ease-out hover:-translate-y-1 border-border/50 fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Session {history.sessionId.slice(0, 8)}...
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {new Date(history.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MessagesSquare className="h-4 w-4" />
                    {history.messageCount ?? 0} msgs
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(history.createdAt).toLocaleString()}</span>
                </div>
                <Link href={`/history/${history.sessionId}`}>
                  <Button
                    className="w-full border-2 hover:bg-accent/50 transition-all hover:scale-105"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="min-w-[180px]"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

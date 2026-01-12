"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, TrendingUp } from "lucide-react";
import { format } from "date-fns";

import { useSessionHistory } from "@/modules/voice/hooks/use-voice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SessionDetailProps {
  sessionId: string;
  score?: number;
}

export function SessionDetail({ sessionId, score }: SessionDetailProps) {
  const {
    data: sessionMessages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSessionHistory(sessionId);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef(true);

  const messages = useMemo(
    () =>
      sessionMessages?.pages
        ?.flatMap((page) => page.data?.histories ?? [])
        .flatMap((history) => history.messages ?? []) ?? [],
    [sessionMessages]
  );

  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading && messages.length > 0 && isInitialLoadRef.current) {
      // Scroll to bottom on initial load
      setTimeout(() => {
        scrollToBottom();
        isInitialLoadRef.current = false;
      }, 100);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!hasNextPage || isFetchingNextPage) return;
      const target = event.currentTarget;
      const threshold = 120;
      if (
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - threshold
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const renderSkeletonMessages = (count = 6) => (
    <div className="space-y-3 lg:space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex",
            index % 2 === 0 ? "justify-start" : "justify-end"
          )}
        >
          <div className="h-16 w-full max-w-[70%] rounded-lg bg-muted/70 animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4 lg:py-6">
      <div className="mb-6 lg:mb-8 fade-in">
        <Link href="/history">
          <Button
            variant="ghost"
            className="mb-3 hover:bg-accent/50 transition-all duration-200 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to History
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2 fade-in">
          Session Details
        </h1>
        <p
          className="text-muted-foreground fade-in"
          style={{ animationDelay: "100ms" }}
        >
          Interview conversation timeline
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <Card className="glass border-border/50 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl gradient-text">
              <MessageSquare className="h-5 w-5" />
              Conversation Timeline
            </CardTitle>
            <CardDescription>Loading session...</CardDescription>
          </CardHeader>
          <CardContent>{renderSkeletonMessages(8)}</CardContent>
        </Card>
      ) : (
        <div className="mx-auto max-w-full space-y-4 lg:space-y-6">
          {score !== undefined && (
            <Card className="glass border-border/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl gradient-text">
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  Interview Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold gradient-text">{score}</p>
                    <p className="text-2xl text-muted-foreground">/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass border-border/50 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl gradient-text">
                <MessageSquare className="h-5 w-5" />
                Conversation Timeline
              </CardTitle>
              <CardDescription>Complete interview conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="space-y-3 lg:space-y-4 max-h-[70vh] overflow-y-auto pr-1.5 lg:pr-2 py-3"
              >
                {!messages || messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No messages found
                    </p>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                      This session has no conversation history
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.timestamp}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                        "slide-in-up"
                      )}
                      style={{
                        animationDelay: `${index * 30}ms`,
                      }}
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-1 w-full",
                          message.role === "user" ? "items-end" : "items-start"
                        )}
                      >
                        <p
                          className={cn("font-medium text-xs text-neutral-500")}
                        >
                          {message.timestamp
                            ? format(message.timestamp, "dd MMM yyyy, HH:mm:ss")
                            : ""}
                        </p>
                        <div
                          className={cn(
                            "max-w-[75%] sm:max-w-[65%] md:max-w-[60%] rounded-lg px-4 py-3 shadow-none text-primary-foreground",
                            message.role === "user"
                              ? "bg-gradient-to-br from-primary to-primary/80"
                              : "bg-red-500/80 border border-border/50"
                          )}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isFetchingNextPage && (
                  <div className="py-2">{renderSkeletonMessages(2)}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

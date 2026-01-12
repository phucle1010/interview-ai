"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, TrendingUp } from "lucide-react";

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
  } = useSessionHistory(sessionId);

  const messages = useMemo(
    () =>
      sessionMessages?.data?.histories
        .map((message) => message.messages)
        .flat(),
    [sessionMessages]
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 fade-in">
        <Link href="/history">
          <Button
            variant="ghost"
            className="mb-4 hover:bg-accent/50 transition-all duration-200 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to History
          </Button>
        </Link>
        <h1 className="text-4xl font-bold gradient-text mb-2 fade-in">
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
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground">Loading session...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
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

          <Card className="glass border-border/50 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl gradient-text">
                <MessageSquare className="h-5 w-5" />
                Conversation Timeline
              </CardTitle>
              <CardDescription>Complete interview conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                            : "glass bg-muted/50 border border-border/50"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p
                          className={`mt-1.5 text-xs ${
                            message.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

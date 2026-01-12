"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSessionHistory } from "@/modules/voice/hooks/use-voice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, TrendingUp } from "lucide-react";

interface SessionDetailProps {
  sessionId: string;
  score?: number;
}

export function SessionDetail({ sessionId, score }: SessionDetailProps) {
  const { data: messages, isLoading, error } = useSessionHistory(sessionId);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/history">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Session Details</h1>
        <p className="text-muted-foreground">Interview conversation timeline</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Interview Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Overall Score
                  </p>
                  <p className="text-3xl font-bold">{score}/100</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation Timeline
              </CardTitle>
              <CardDescription>Complete interview conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!messages || messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No messages found in this session
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.type === "user"
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

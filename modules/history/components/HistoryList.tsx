"use client";

import Link from "next/link";
import { useUserInterviews } from "../hooks/use-history";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";

export function HistoryList() {
  const { user } = useAuthStore();
  const {
    data: sessions,
    isLoading,
    error,
  } = useUserInterviews(user?.id || null);

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

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error.message}
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
      ) : !sessions || sessions.length === 0 ? (
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
          {sessions.map((session, index) => (
            <Card
              key={session.id}
              className="glass group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ease-out hover:-translate-y-1 border-border/50 fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {session.jobRole}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {session.experienceLevel}
                  </span>
                  <span>•</span>
                  <span>{session.language.toUpperCase()}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {session.score !== undefined && (
                  <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-3 border border-primary/20">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className="text-xl font-bold text-primary">
                        {session.score}
                      </p>
                    </div>
                  </div>
                )}
                <Link href={`/history/${session.sessionId}`}>
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
    </div>
  );
}

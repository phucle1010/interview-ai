"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInterviewSetups } from "@/modules/interview/hooks/use-interview-setup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export function DashboardContent() {
  const router = useRouter();
  const { data: setupQuery, isLoading, error } = useInterviewSetups();

  const handleStartInterview = (
    setupId: string,
    role: string,
    level: string,
    focusAreas: string[],
    language: string,
    maxQuestions: number
  ) => {
    const searchParams = new URLSearchParams();
    searchParams.set("setupId", setupId);
    searchParams.set("role", role);
    searchParams.set("level", level);
    searchParams.set("focusAreas", focusAreas.join(","));
    searchParams.set("language", language);
    searchParams.set("maxQuestions", maxQuestions.toString());
    router.push(`/interview?${searchParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between fade-in">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 fade-in">
            Dashboard
          </h1>
          <p
            className="text-muted-foreground fade-in"
            style={{ animationDelay: "100ms" }}
          >
            Manage your interview setups
          </p>
        </div>
        <Link
          href="/dashboard/setup"
          className="fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            New Setup
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
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
      ) : !setupQuery?.setups || setupQuery?.setups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              No interview setups yet
            </p>
            <Link href="/dashboard/setup">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Setup
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(setupQuery?.setups || []).map((setup, index) => (
            <Card
              key={`setup-${setup._id}-${index}`}
              className="glass group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ease-out hover:-translate-y-1 border-border/50 fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {setup.jobRole}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {setup.experienceLevel}
                  </span>
                  <span>•</span>
                  <span>{setup.language.toUpperCase()}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {setup.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-md bg-gradient-to-r from-accent/20 to-accent/10 px-2 py-1 text-xs font-medium text-accent-foreground border border-accent/20"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(setup.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 transition-all hover:scale-105"
                  onClick={() =>
                    handleStartInterview(
                      setup._id,
                      setup.jobRole,
                      setup.experienceLevel,
                      setup.focusAreas,
                      setup.language,
                      setup.maxQuestions || 10
                    )
                  }
                >
                  Start Interview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

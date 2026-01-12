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
  const { data: setups, isLoading, error } = useInterviewSetups();

  const handleStartInterview = (setupId: string) => {
    router.push(`/interview?setupId=${setupId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your interview setups</p>
        </div>
        <Link href="/dashboard/setup">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Setup
          </Button>
        </Link>
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
      ) : !setups || setups.length === 0 ? (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {setups.map((setup) => (
            <Card key={setup.id}>
              <CardHeader>
                <CardTitle>{setup.jobRole}</CardTitle>
                <CardDescription>
                  {setup.experienceLevel} • {setup.language}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-sm font-medium">Focus Areas:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {setup.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full bg-secondary px-2 py-1 text-xs"
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
                  className="w-full"
                  onClick={() => handleStartInterview(setup.id)}
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

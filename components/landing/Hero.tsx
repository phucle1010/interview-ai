"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent -z-10" />

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000 -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8 fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20 fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              AI-Powered Interview Practice
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <span className="gradient-text">Master Your</span>
            <br />
            <span className="gradient-text">Interview Skills</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed fade-in"
            style={{ animationDelay: "200ms" }}
          >
            Practice with AI-powered real-time speech recognition. Get instant
            feedback and improve your interview performance with confidence.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30 text-lg px-8 py-6 h-auto transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="group text-lg px-8 py-6 h-auto border-2 hover:bg-accent/50 transition-all hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="pt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span>10,000+ users</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
            <div>⭐ 4.9/5 rating</div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
            <div>🚀 Free to start</div>
          </div>
        </div>
      </div>
    </section>
  );
}

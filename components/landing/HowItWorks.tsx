"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  UserPlus,
  Mic,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up in seconds and set up your interview preferences. Choose your role, experience level, and focus areas.",
    gradient: "from-primary to-primary/60",
  },
  {
    number: "02",
    icon: Mic,
    title: "Start Practicing",
    description:
      "Begin your interview session. Our AI will ask you questions based on your profile and listen to your responses.",
    gradient: "from-accent to-accent/60",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Get Real-time Feedback",
    description:
      "Receive instant AI-powered feedback on your answers. Improve your communication skills with every session.",
    gradient: "from-primary to-accent",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Monitor your improvement over time with detailed analytics and performance insights.",
    gradient: "from-accent to-primary",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and transform your interview skills
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}

                <Card className="glass h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 border-border/50 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-primary mb-1">
                          {step.number}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="text-center fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30 text-lg px-8 py-6 h-auto transition-all hover:scale-105"
            >
              Start Your First Interview
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

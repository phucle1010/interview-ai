"use client";

import {
  Mic,
  Brain,
  Zap,
  BarChart3,
  Globe,
  Shield,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "Real-time Speech Recognition",
    description:
      "Advanced AI-powered speech-to-text that captures every word accurately in real-time.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description:
      "Get instant, intelligent feedback on your answers to improve your interview skills.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description:
      "Lightning-fast AI responses that simulate real interview conversations.",
    gradient: "from-primary to-accent",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track your progress with detailed analytics and performance metrics.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description:
      "Practice interviews in multiple languages with native-level recognition.",
    gradient: "from-primary/80 to-accent/80",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is secure and private. We never share your interview sessions.",
    gradient: "from-accent/80 to-primary/80",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you ace your next interview
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="glass group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 border-border/50 fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

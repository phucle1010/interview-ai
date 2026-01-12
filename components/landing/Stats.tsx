"use client";

import { TrendingUp, Users, Clock, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Clock,
    value: "50K+",
    label: "Interviews Completed",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    gradient: "from-primary to-accent",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    gradient: "from-accent to-primary",
  },
];

export function Stats() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 transition-transform hover:scale-110`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

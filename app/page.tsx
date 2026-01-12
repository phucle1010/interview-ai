"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/storages/auth";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (auth.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Stats />
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Footer />
    </div>
  );
}

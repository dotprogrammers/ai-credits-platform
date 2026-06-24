"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 animate-fade-in px-3 py-1 text-xs"
          >
            <Sparkles className="mr-1 size-3" />
            Now in Public Beta
          </Badge>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
            Trade AI API Credits on the{" "}
            <span className="text-gradient">Open Marketplace</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground animate-fade-in-up delay-200">
            Buy, sell, and trade AI API credits across OpenAI, Anthropic, Google,
            and more. Real-time pricing, instant settlement, and zero lock-in.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-400">
            <Link href="/register" className={cn(buttonVariants({ size: "lg", className: "h-12 px-8 text-base" }))}>
              Start Trading
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/pricing" className={cn(buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 text-base" }))}>
              View Pricing
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground animate-fade-in-up delay-600">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-green-500" />
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <span>Real-time pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>10+ AI providers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

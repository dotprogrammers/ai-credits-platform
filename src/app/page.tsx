import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { LiveStatsBar } from "@/components/landing/live-stats-bar";
import { FeaturesSection } from "@/components/landing/features-section";
import { ProvidersShowcase } from "@/components/landing/providers-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "AI Credits - Trade AI API Credits on the Open Marketplace",
  description:
    "Buy, sell, and trade AI API credits across OpenAI, Anthropic, Google, and more. The open marketplace for AI compute with real-time pricing and instant settlement.",
  keywords: [
    "AI credits",
    "API marketplace",
    "OpenAI credits",
    "Anthropic",
    "AI trading",
  ],
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <LiveStatsBar />
      <FeaturesSection />
      <ProvidersShowcase />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}

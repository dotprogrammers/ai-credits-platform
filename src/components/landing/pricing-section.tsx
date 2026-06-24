"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "For individual traders getting started",
    price: "0",
    commission: "2.5%",
    icon: <Zap className="size-5" />,
    features: [
      "Up to $1,000/mo trading volume",
      "Basic market data",
      "Standard settlement (5 min)",
      "Community support",
      "Single wallet",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    description: "For active traders and developers",
    price: "29",
    commission: "1.0%",
    icon: <Crown className="size-5" />,
    features: [
      "Up to $50,000/mo trading volume",
      "Real-time market data & alerts",
      "Instant settlement",
      "Priority support",
      "Multiple wallets",
      "API access",
      "Advanced analytics",
    ],
    cta: "Start Pro Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and high-volume traders",
    price: "Custom",
    commission: "0.25%",
    icon: <Building2 className="size-5" />,
    features: [
      "Unlimited trading volume",
      "Dedicated market data feeds",
      "Instant settlement + SLA",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Compliance & reporting",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-muted/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Pay only for what you use. Upgrade anytime as your
            trading grows.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular
                  ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Price */}
                <div className="mb-6">
                  {plan.price === "Custom" ? (
                    <span className="text-4xl font-bold">Custom</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.commission} trading commission
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="size-4 mt-0.5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={cn(buttonVariants({ variant: plan.variant, size: "lg", className: "w-full" }))}
                >
                  {plan.cta}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

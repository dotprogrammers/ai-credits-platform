import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Check,
  Zap,
  Crown,
  Building2,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing - AI Credits Trading Platform",
  description:
    "Simple, transparent pricing. Start for free, upgrade as you grow. No hidden fees.",
};

const plans = [
  {
    name: "Free",
    description: "For individual traders getting started",
    price: "0",
    period: "forever",
    commission: "2.5%",
    icon: <Zap className="size-5" />,
    features: [
      "Up to $1,000/mo trading volume",
      "Basic market data",
      "Standard settlement (5 min)",
      "Community support",
      "Single wallet",
      "Email notifications",
    ],
    cta: "Start Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    description: "For active traders and developers",
    price: "29",
    period: "month",
    commission: "1.0%",
    icon: <Crown className="size-5" />,
    features: [
      "Up to $50,000/mo trading volume",
      "Real-time market data & alerts",
      "Instant settlement",
      "Priority email & chat support",
      "Multiple wallets",
      "Full API access",
      "Advanced analytics & charts",
      "Custom price alerts",
      "Portfolio tracking",
    ],
    cta: "Start 14-Day Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and high-volume traders",
    price: "Custom",
    period: "",
    commission: "0.25%",
    icon: <Building2 className="size-5" />,
    features: [
      "Unlimited trading volume",
      "Dedicated market data feeds",
      "Instant settlement + SLA",
      "Dedicated account manager",
      "Custom integrations & webhooks",
      "White-label options",
      "Compliance & audit reporting",
      "Volume discounts",
      "SSO & team management",
      "Custom contract terms",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and bank transfers. Enterprise customers can also pay via invoice.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No. All plans are month-to-month with no long-term commitment. You can cancel anytime.",
  },
  {
    question: "What happens if I exceed my trading volume?",
    answer:
      "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional volume at a per-unit rate.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page header */}
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start for free. Upgrade as you grow. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-8 lg:grid-cols-3 mb-20">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular ? "ring-2 ring-primary shadow-lg" : ""
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
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
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

      {/* FAQ section */}
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <HelpCircle className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Zap,
  Target,
  Users,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About - AI Credits Trading Platform",
  description:
    "Learn about our mission to create an open marketplace for AI API credits and build the future of AI compute trading.",
};

const values = [
  {
    icon: <Globe className="size-5" />,
    title: "Open Marketplace",
    description:
      "We believe AI credits should be freely tradable. Our platform creates a transparent, efficient market for AI compute.",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Trust & Security",
    description:
      "Every trade is protected by our escrow system. We prioritize security and transparency in everything we do.",
  },
  {
    icon: <TrendingUp className="size-5" />,
    title: "Fair Pricing",
    description:
      "Real-time market data ensures fair prices for everyone. No hidden fees, no manipulation, just supply and demand.",
  },
  {
    icon: <Users className="size-5" />,
    title: "Community First",
    description:
      "We're building for the AI community. Our roadmap is shaped by the traders and developers who use our platform daily.",
  },
];

const stats = [
  { label: "Credits Traded", value: "$50M+" },
  { label: "Active Users", value: "12,000+" },
  { label: "Supported Providers", value: "10+" },
  { label: "Countries", value: "80+" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero section */}
      <div className="mx-auto max-w-3xl text-center mb-20">
        <Badge variant="secondary" className="mb-4">
          About Us
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          Building the Open Marketplace for AI Compute
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We&apos;re on a mission to make AI API credits as liquid and tradable
          as any other commodity. Our platform connects buyers and sellers in a
          transparent, secure marketplace that benefits the entire AI ecosystem.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-20">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card p-6 text-center"
          >
            <div className="text-3xl font-bold text-gradient mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Story section */}
      <div className="mx-auto max-w-3xl mb-20">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">
          Our Story
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The AI industry is experiencing explosive growth. Companies are
            spending billions on AI API credits from providers like OpenAI,
            Anthropic, and Google. But there&apos;s been a fundamental problem:
            once you buy credits, you&apos;re locked in. No way to sell unused
            credits, no way to find better prices, no market to discover fair
            value.
          </p>
          <p>
            We founded AI Credits Trading Platform to solve this. We believe
            that an open marketplace for AI credits will lead to better pricing,
            more efficient allocation of compute resources, and a healthier AI
            ecosystem for everyone -- from individual developers to Fortune 500
            companies.
          </p>
          <p>
            Today, our platform serves thousands of traders across 80+ countries,
            facilitating millions of dollars in AI credit trades every month. And
            we&apos;re just getting started.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
          Our Values
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  {value.icon}
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team section */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Join Our Team
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We&apos;re a remote-first team of engineers, designers, and AI
          enthusiasts building the future of AI commerce. If you&apos;re
          passionate about marketplaces, AI, and building products that matter,
          we&apos;d love to hear from you.
        </p>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          We&apos;re hiring -- check our careers page for open positions
        </Badge>
      </div>
    </div>
  );
}

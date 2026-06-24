import {
  ArrowRightLeft,
  BarChart3,
  Clock,
  Globe,
  Lock,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: <ArrowRightLeft className="size-5" />,
    title: "Peer-to-Peer Trading",
    description:
      "Trade AI credits directly with other users. Set your own prices, negotiate deals, and settle instantly with our escrow system.",
  },
  {
    icon: <BarChart3 className="size-5" />,
    title: "Real-Time Market Data",
    description:
      "Live price feeds, historical charts, and market depth across all supported AI providers. Make informed trading decisions.",
  },
  {
    icon: <Clock className="size-5" />,
    title: "Instant Settlement",
    description:
      "Credits transfer immediately after trade confirmation. No waiting periods, no manual approvals. Fast and frictionless.",
  },
  {
    icon: <Globe className="size-5" />,
    title: "Multi-Provider Support",
    description:
      "Support for OpenAI, Anthropic, Google, Mistral, Meta, Cohere, and more. One platform for all your AI credit needs.",
  },
  {
    icon: <Lock className="size-5" />,
    title: "Secure Escrow",
    description:
      "Every trade is protected by our escrow system. Funds are held securely until both parties confirm the transfer is complete.",
  },
  {
    icon: <Wallet className="size-5" />,
    title: "Flexible Wallets",
    description:
      "Manage credits across multiple providers from a single dashboard. Track balances, spending, and trading history in real time.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">trade AI credits</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete marketplace built for the AI economy. Trade with
            confidence using our secure, transparent platform.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

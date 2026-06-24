import { UserPlus, ArrowRightLeft, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <UserPlus className="size-6" />,
    title: "Create Your Account",
    description:
      "Sign up in seconds with your email or GitHub. Connect your AI provider accounts and fund your wallet to start trading.",
  },
  {
    number: "02",
    icon: <ArrowRightLeft className="size-6" />,
    title: "Browse & Trade",
    description:
      "Explore the marketplace to find the best prices on AI credits. Place orders, set alerts, or trade directly with other users.",
  },
  {
    number: "03",
    icon: <Rocket className="size-6" />,
    title: "Use Your Credits",
    description:
      "Credits are transferred instantly to your wallet. Use them with any supported AI provider through our unified API or your own keys.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in three simple steps. Start trading AI credits in
            minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-[calc(50%+3rem)] hidden w-[calc(100%-6rem)] h-px bg-border sm:block">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number and icon */}
                <div className="relative mb-6">
                  <div className="flex size-24 items-center justify-center rounded-full border-2 border-border bg-card transition-colors hover:border-primary/50">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

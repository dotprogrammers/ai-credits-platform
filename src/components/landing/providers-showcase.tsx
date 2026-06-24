"use client";

const providers = [
  {
    name: "OpenAI",
    logo: "GPT",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "Anthropic",
    logo: "CL",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Google",
    logo: "G",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Mistral",
    logo: "M",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    name: "Meta",
    logo: "M",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    name: "Cohere",
    logo: "C",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export function ProvidersShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Supported AI Providers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Trade credits across all major AI platforms. More providers added
            regularly.
          </p>
        </div>

        {/* Provider logos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
            >
              <div
                className={`flex size-14 items-center justify-center rounded-xl ${provider.bgColor} ${provider.color} text-xl font-bold transition-transform group-hover:scale-110`}
              >
                {provider.logo}
              </div>
              <span className="text-sm font-medium text-foreground">
                {provider.name}
              </span>
            </div>
          ))}
        </div>

        {/* Coming soon note */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Plus 10+ more providers. Including Azure OpenAI, AWS Bedrock,
          Together AI, Fireworks, and more.
        </p>
      </div>
    </section>
  );
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLanding() {
  console.log("Seeding landing page content...");

  // Hero section
  await prisma.landingSection.upsert({
    where: { sectionKey: "hero" },
    update: {
      title: "Trade AI Credits with Confidence",
      content: {
        subtitle: "The premier marketplace for buying and selling AI API credits",
        description: "Access discounted credits from OpenAI, Anthropic, Google, Mistral, Meta, and more. Trade with real-time pricing, secure transactions, and deep liquidity.",
        ctaPrimary: { text: "Start Trading", href: "/marketplace" },
        ctaSecondary: { text: "Learn More", href: "/how-it-works" },
        backgroundVariant: "gradient",
      },
      sortOrder: 1,
      isActive: true,
    },
    create: {
      sectionKey: "hero",
      title: "Trade AI Credits with Confidence",
      content: {
        subtitle: "The premier marketplace for buying and selling AI API credits",
        description: "Access discounted credits from OpenAI, Anthropic, Google, Mistral, Meta, and more. Trade with real-time pricing, secure transactions, and deep liquidity.",
        ctaPrimary: { text: "Start Trading", href: "/marketplace" },
        ctaSecondary: { text: "Learn More", href: "/how-it-works" },
        backgroundVariant: "gradient",
      },
      sortOrder: 1,
      isActive: true,
    },
  });

  // Stats section
  await prisma.landingSection.upsert({
    where: { sectionKey: "stats" },
    update: {
      title: "Platform Statistics",
      content: {
        stats: [
          { label: "Total Trading Volume", value: "$2.4M+", icon: "TrendingUp" },
          { label: "Active Traders", value: "1,200+", icon: "Users" },
          { label: "AI Providers", value: "6", icon: "Building2" },
          { label: "Credit Products", value: "20+", icon: "Package" },
          { label: "Avg. Trade Size", value: "$850", icon: "BarChart3" },
          { label: "Settlement Time", value: "< 1 min", icon: "Zap" },
        ],
      },
      sortOrder: 2,
      isActive: true,
    },
    create: {
      sectionKey: "stats",
      title: "Platform Statistics",
      content: {
        stats: [
          { label: "Total Trading Volume", value: "$2.4M+", icon: "TrendingUp" },
          { label: "Active Traders", value: "1,200+", icon: "Users" },
          { label: "AI Providers", value: "6", icon: "Building2" },
          { label: "Credit Products", value: "20+", icon: "Package" },
          { label: "Avg. Trade Size", value: "$850", icon: "BarChart3" },
          { label: "Settlement Time", value: "< 1 min", icon: "Zap" },
        ],
      },
      sortOrder: 2,
      isActive: true,
    },
  });

  // Features section
  await prisma.landingSection.upsert({
    where: { sectionKey: "features" },
    update: {
      title: "Why Trade on AI Credits Exchange",
      content: {
        subtitle: "Everything you need to trade AI credits efficiently",
        features: [
          {
            icon: "Shield",
            title: "Secure & Compliant",
            description: "Bank-grade security with KYC verification, 2FA, and encrypted transactions. Your credits and funds are protected.",
          },
          {
            icon: "Zap",
            title: "Real-Time Trading",
            description: "Live order books, instant execution, and WebSocket-powered price updates. Never miss a trading opportunity.",
          },
          {
            icon: "BarChart3",
            title: "Deep Liquidity",
            description: "Tight bid-ask spreads across 20+ products. Trade large volumes without significant price impact.",
          },
          {
            icon: "Gavel",
            title: "Auction Marketplace",
            description: "Buy and sell large credit blocks through our auction system. Perfect for enterprise-sized transactions.",
          },
          {
            icon: "Wallet",
            title: "Flexible Payments",
            description: "Deposit via credit card, bank transfer, or cryptocurrency. Multiple withdrawal options with competitive fees.",
          },
          {
            icon: "Code",
            title: "Trading API",
            description: "Full-featured REST API for algorithmic trading. Build bots, integrate with your systems, and automate your strategy.",
          },
        ],
      },
      sortOrder: 3,
      isActive: true,
    },
    create: {
      sectionKey: "features",
      title: "Why Trade on AI Credits Exchange",
      content: {
        subtitle: "Everything you need to trade AI credits efficiently",
        features: [
          {
            icon: "Shield",
            title: "Secure & Compliant",
            description: "Bank-grade security with KYC verification, 2FA, and encrypted transactions. Your credits and funds are protected.",
          },
          {
            icon: "Zap",
            title: "Real-Time Trading",
            description: "Live order books, instant execution, and WebSocket-powered price updates. Never miss a trading opportunity.",
          },
          {
            icon: "BarChart3",
            title: "Deep Liquidity",
            description: "Tight bid-ask spreads across 20+ products. Trade large volumes without significant price impact.",
          },
          {
            icon: "Gavel",
            title: "Auction Marketplace",
            description: "Buy and sell large credit blocks through our auction system. Perfect for enterprise-sized transactions.",
          },
          {
            icon: "Wallet",
            title: "Flexible Payments",
            description: "Deposit via credit card, bank transfer, or cryptocurrency. Multiple withdrawal options with competitive fees.",
          },
          {
            icon: "Code",
            title: "Trading API",
            description: "Full-featured REST API for algorithmic trading. Build bots, integrate with your systems, and automate your strategy.",
          },
        ],
      },
      sortOrder: 3,
      isActive: true,
    },
  });

  // How it works section
  await prisma.landingSection.upsert({
    where: { sectionKey: "how-it-works" },
    update: {
      title: "How It Works",
      content: {
        subtitle: "Start trading in three simple steps",
        steps: [
          {
            number: 1,
            title: "Create & Verify Your Account",
            description: "Sign up with your email, complete KYC verification, and fund your wallet. Takes less than 5 minutes.",
          },
          {
            number: 2,
            title: "Browse & Place Orders",
            description: "Explore AI credit products from top providers. Place limit or market orders, or join an auction for bulk purchases.",
          },
          {
            number: 3,
            title: "Trade & Manage",
            description: "Your orders execute in real-time. Track your portfolio, set price alerts, and manage your positions from the dashboard.",
          },
        ],
      },
      sortOrder: 4,
      isActive: true,
    },
    create: {
      sectionKey: "how-it-works",
      title: "How It Works",
      content: {
        subtitle: "Start trading in three simple steps",
        steps: [
          {
            number: 1,
            title: "Create & Verify Your Account",
            description: "Sign up with your email, complete KYC verification, and fund your wallet. Takes less than 5 minutes.",
          },
          {
            number: 2,
            title: "Browse & Place Orders",
            description: "Explore AI credit products from top providers. Place limit or market orders, or join an auction for bulk purchases.",
          },
          {
            number: 3,
            title: "Trade & Manage",
            description: "Your orders execute in real-time. Track your portfolio, set price alerts, and manage your positions from the dashboard.",
          },
        ],
      },
      sortOrder: 4,
      isActive: true,
    },
  });

  // Pricing section
  await prisma.landingSection.upsert({
    where: { sectionKey: "pricing" },
    update: {
      title: "Transparent Pricing",
      content: {
        subtitle: "Low fees, no hidden charges",
        plans: [
          {
            name: "Standard",
            price: "0.25%",
            period: "per trade",
            description: "For individual traders and small teams",
            features: [
              "0.25% trading commission",
              "Free deposits (bank transfer)",
              "$1 auction listing fee",
              "Standard support",
              "Basic API access",
            ],
            cta: { text: "Get Started", href: "/register" },
            highlighted: false,
          },
          {
            name: "Pro",
            price: "0.15%",
            period: "per trade",
            description: "For active traders and businesses",
            features: [
              "0.15% trading commission",
              "Free deposits (all methods)",
              "Free auction listings",
              "Priority support",
              "Full API access",
              "Advanced analytics",
              "Dedicated account manager",
            ],
            cta: { text: "Contact Sales", href: "/contact" },
            highlighted: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "volume-based",
            description: "For high-volume institutional traders",
            features: [
              "Custom commission rates",
              "Dedicated liquidity",
              "OTC desk access",
              "24/7 premium support",
              "Custom API limits",
              "White-glove onboarding",
              "Compliance documentation",
            ],
            cta: { text: "Contact Sales", href: "/contact" },
            highlighted: false,
          },
        ],
      },
      sortOrder: 5,
      isActive: true,
    },
    create: {
      sectionKey: "pricing",
      title: "Transparent Pricing",
      content: {
        subtitle: "Low fees, no hidden charges",
        plans: [
          {
            name: "Standard",
            price: "0.25%",
            period: "per trade",
            description: "For individual traders and small teams",
            features: [
              "0.25% trading commission",
              "Free deposits (bank transfer)",
              "$1 auction listing fee",
              "Standard support",
              "Basic API access",
            ],
            cta: { text: "Get Started", href: "/register" },
            highlighted: false,
          },
          {
            name: "Pro",
            price: "0.15%",
            period: "per trade",
            description: "For active traders and businesses",
            features: [
              "0.15% trading commission",
              "Free deposits (all methods)",
              "Free auction listings",
              "Priority support",
              "Full API access",
              "Advanced analytics",
              "Dedicated account manager",
            ],
            cta: { text: "Contact Sales", href: "/contact" },
            highlighted: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "volume-based",
            description: "For high-volume institutional traders",
            features: [
              "Custom commission rates",
              "Dedicated liquidity",
              "OTC desk access",
              "24/7 premium support",
              "Custom API limits",
              "White-glove onboarding",
              "Compliance documentation",
            ],
            cta: { text: "Contact Sales", href: "/contact" },
            highlighted: false,
          },
        ],
      },
      sortOrder: 5,
      isActive: true,
    },
  });

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "TechFlow Inc.",
      content: "AI Credits Exchange has transformed how we manage our AI API budget. We save 15-20% by buying credits on the secondary market instead of directly from providers.",
      rating: 5,
      sortOrder: 1,
    },
    {
      name: "Marcus Johnson",
      role: "AI Engineer",
      company: "DataScale",
      content: "The order book depth is impressive. I can execute large trades without moving the market. The API is clean and well-documented — perfect for our automated trading bot.",
      rating: 5,
      sortOrder: 2,
    },
    {
      name: "Elena Rodriguez",
      role: "Procurement Manager",
      company: "GlobalCorp",
      content: "We had $200K in unused OpenAI credits sitting on our balance sheet. Within a week on this platform, we sold them at a minimal discount. Incredible liquidity.",
      rating: 5,
      sortOrder: 3,
    },
    {
      name: "David Park",
      role: "Founder",
      company: "AI Startup Labs",
      content: "As a startup, every dollar counts. Buying discounted AI credits here instead of at face value has extended our runway by months. The auction feature is great for bulk purchases.",
      rating: 4,
      sortOrder: 4,
    },
    {
      name: "Priya Sharma",
      role: "VP Engineering",
      company: "CloudNative Co.",
      content: "The platform's security and compliance features gave our legal team confidence. KYC was smooth, and the audit trail is comprehensive. Exactly what an enterprise needs.",
      rating: 5,
      sortOrder: 5,
    },
    {
      name: "Thomas Mueller",
      role: "Head of AI",
      company: "EuroTech GmbH",
      content: "Being able to trade Mistral credits alongside OpenAI and Anthropic gives us flexibility. We optimize our AI spend across providers based on real-time market prices.",
      rating: 5,
      sortOrder: 6,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${t.sortOrder}` },
      update: {
        name: t.name,
        role: t.role,
        company: t.company,
        content: t.content,
        rating: t.rating,
        sortOrder: t.sortOrder,
        isActive: true,
      },
      create: {
        id: `testimonial-${t.sortOrder}`,
        name: t.name,
        role: t.role,
        company: t.company,
        content: t.content,
        rating: t.rating,
        sortOrder: t.sortOrder,
        isActive: true,
      },
    });
  }

  // FAQ section
  await prisma.landingSection.upsert({
    where: { sectionKey: "faq" },
    update: {
      title: "Frequently Asked Questions",
      content: {
        items: [
          {
            question: "What are AI credits?",
            answer: "AI credits are prepaid units that give you access to AI API services from providers like OpenAI, Anthropic, and Google. Each credit represents a certain amount of API usage, and they can be traded on our marketplace.",
          },
          {
            question: "How do I buy AI credits?",
            answer: "Create an account, complete KYC verification, deposit funds, then browse the marketplace to find credits you want to buy. You can place limit orders at your desired price or buy immediately at the ask price.",
          },
          {
            question: "Are the credits legitimate?",
            answer: "Yes. All credits traded on our platform come from verified sources — typically enterprise customers who purchased directly from AI providers and have excess credits they no longer need. We verify the provenance of all listed credits.",
          },
          {
            question: "What fees do you charge?",
            answer: "We charge a 0.25% commission on each trade (both buyer and seller). Auction listings have a flat $1 fee. Deposits via bank transfer are free; credit card deposits have a 2.9% processing fee.",
          },
          {
            question: "How fast are trades settled?",
            answer: "Market orders execute instantly. Limit orders fill when a matching order is found. Credits are transferred to your wallet immediately upon trade completion.",
          },
          {
            question: "Can I sell my unused credits?",
            answer: "Absolutely. List your credits for sale via the order book or auction system. Set your price, and wait for a buyer. You can also use market orders for instant selling at the best available bid.",
          },
        ],
      },
      sortOrder: 6,
      isActive: true,
    },
    create: {
      sectionKey: "faq",
      title: "Frequently Asked Questions",
      content: {
        items: [
          {
            question: "What are AI credits?",
            answer: "AI credits are prepaid units that give you access to AI API services from providers like OpenAI, Anthropic, and Google. Each credit represents a certain amount of API usage, and they can be traded on our marketplace.",
          },
          {
            question: "How do I buy AI credits?",
            answer: "Create an account, complete KYC verification, deposit funds, then browse the marketplace to find credits you want to buy. You can place limit orders at your desired price or buy immediately at the ask price.",
          },
          {
            question: "Are the credits legitimate?",
            answer: "Yes. All credits traded on our platform come from verified sources — typically enterprise customers who purchased directly from AI providers and have excess credits they no longer need. We verify the provenance of all listed credits.",
          },
          {
            question: "What fees do you charge?",
            answer: "We charge a 0.25% commission on each trade (both buyer and seller). Auction listings have a flat $1 fee. Deposits via bank transfer are free; credit card deposits have a 2.9% processing fee.",
          },
          {
            question: "How fast are trades settled?",
            answer: "Market orders execute instantly. Limit orders fill when a matching order is found. Credits are transferred to your wallet immediately upon trade completion.",
          },
          {
            question: "Can I sell my unused credits?",
            answer: "Absolutely. List your credits for sale via the order book or auction system. Set your price, and wait for a buyer. You can also use market orders for instant selling at the best available bid.",
          },
        ],
      },
      sortOrder: 6,
      isActive: true,
    },
  });

  // CTA section
  await prisma.landingSection.upsert({
    where: { sectionKey: "cta" },
    update: {
      title: "Ready to Start Trading?",
      content: {
        description: "Join thousands of traders already buying and selling AI credits. Create your free account in minutes.",
        ctaPrimary: { text: "Create Free Account", href: "/register" },
        ctaSecondary: { text: "View Marketplace", href: "/marketplace" },
      },
      sortOrder: 7,
      isActive: true,
    },
    create: {
      sectionKey: "cta",
      title: "Ready to Start Trading?",
      content: {
        description: "Join thousands of traders already buying and selling AI credits. Create your free account in minutes.",
        ctaPrimary: { text: "Create Free Account", href: "/register" },
        ctaSecondary: { text: "View Marketplace", href: "/marketplace" },
      },
      sortOrder: 7,
      isActive: true,
    },
  });

  console.log("Created 7 landing page sections and 6 testimonials");
}

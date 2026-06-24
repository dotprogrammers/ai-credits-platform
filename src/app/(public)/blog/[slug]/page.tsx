import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  MessageCircle,
  Link2,
} from "lucide-react";

// Mock data (will be replaced with real data fetching)
const post = {
  slug: "introducing-ai-credits-marketplace",
  title: "Introducing the AI Credits Marketplace",
  excerpt:
    "We're excited to launch the first open marketplace for trading AI API credits. Learn how it works and why we built it.",
  category: "Announcements",
  date: "2025-01-15",
  readTime: "5 min read",
  author: "AI Credits Team",
  content: `
## Why We Built This

The AI industry is growing at an unprecedented pace. Companies and developers are spending billions on AI API credits from providers like OpenAI, Anthropic, and Google. But there's been a problem: once you buy credits, you're stuck with them. No way to sell unused credits, no way to buy at better prices, no marketplace to find deals.

We built the AI Credits Trading Platform to solve this problem. Our marketplace connects buyers and sellers, enabling real-time price discovery and instant settlement for AI API credits.

## How It Works

The platform is simple to use:

1. **Create an account** - Sign up with your email or GitHub account
2. **Connect your providers** - Link your AI provider accounts (OpenAI, Anthropic, etc.)
3. **Browse the marketplace** - See real-time prices for credits across all providers
4. **Place orders** - Buy credits at market price or set limit orders
5. **Settle instantly** - Credits transfer immediately after trade confirmation

## Key Features

### Real-Time Pricing
Our platform aggregates pricing data from all supported providers and presents it in a clean, easy-to-read interface. See historical trends, market depth, and price alerts.

### Secure Escrow
Every trade is protected by our escrow system. Funds are held securely until both parties confirm the transfer is complete. No more worrying about scams or failed transfers.

### Multi-Provider Support
Trade credits across OpenAI, Anthropic, Google, Mistral, Meta, Cohere, and more -- all from a single dashboard.

### Low Fees
We charge a simple, transparent fee structure. Free tier users pay 2.5% per trade, Pro users pay 1.0%, and Enterprise users pay as low as 0.25%.

## What's Next

We're just getting started. Here's what's coming soon:

- **API access** for programmatic trading
- **Advanced order types** (stop-loss, take-profit)
- **Portfolio analytics** and reporting
- **Mobile app** for trading on the go
- **More providers** including Azure OpenAI and AWS Bedrock

## Join Us

The AI Credits marketplace is now in public beta. Sign up today and be among the first to trade AI credits on the open market.

We believe that an open marketplace for AI credits will lead to better pricing, more efficient allocation of compute resources, and a healthier AI ecosystem for everyone.
  `,
};

export const metadata: Metadata = {
  title: `${post.title} - AI Credits Blog`,
  description: post.excerpt,
};

export default function BlogPostPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <Badge variant="secondary" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="size-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Content */}
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        {post.content.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2
                key={index}
                className="text-2xl font-bold tracking-tight mt-10 mb-4"
              >
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3
                key={index}
                className="text-xl font-semibold tracking-tight mt-8 mb-3"
              >
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("1. ") || paragraph.startsWith("2. ") || paragraph.startsWith("3. ") || paragraph.startsWith("4. ") || paragraph.startsWith("5. ")) {
            const items = paragraph.split("\n");
            return (
              <ol key={index} className="list-decimal list-inside space-y-2 my-4">
                {items.map((item, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed">
                    {item.replace(/^\d+\.\s\*\*(.+?)\*\*\s*-\s*/, "").replace(/^\d+\.\s/, "")}
                  </li>
                ))}
              </ol>
            );
          }
          if (paragraph.startsWith("- ")) {
            const items = paragraph.split("\n");
            return (
              <ul key={index} className="list-disc list-inside space-y-2 my-4">
                {items.map((item, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed">
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="text-muted-foreground leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        })}
      </div>

      <Separator className="my-8" />

      {/* Share */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Share2 className="size-4" />
          <span>Share this article</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Share on social media">
            <MessageCircle className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Copy link">
            <Link2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

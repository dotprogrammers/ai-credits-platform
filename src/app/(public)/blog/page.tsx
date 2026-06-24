import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - AI Credits Trading Platform",
  description:
    "Latest news, guides, and insights about AI credit trading, marketplace trends, and the AI economy.",
};

const categories = [
  "All",
  "Marketplace",
  "Guides",
  "Announcements",
  "AI Industry",
  "Tutorials",
];

// Mock blog posts (will be replaced with real data fetching)
const posts = [
  {
    slug: "introducing-ai-credits-marketplace",
    title: "Introducing the AI Credits Marketplace",
    excerpt:
      "We're excited to launch the first open marketplace for trading AI API credits. Learn how it works and why we built it.",
    category: "Announcements",
    date: "2025-01-15",
    readTime: "5 min read",
    author: "AI Credits Team",
  },
  {
    slug: "how-to-save-on-openai-api-costs",
    title: "How to Save 30% on OpenAI API Costs",
    excerpt:
      "Practical strategies for reducing your OpenAI spending by buying credits at the right time and using our marketplace effectively.",
    category: "Guides",
    date: "2025-01-12",
    readTime: "8 min read",
    author: "Sarah Chen",
  },
  {
    slug: "ai-credit-pricing-trends-2025",
    title: "AI Credit Pricing Trends to Watch in 2025",
    excerpt:
      "Analysis of pricing trends across major AI providers and what they mean for traders. Plus predictions for the coming year.",
    category: "AI Industry",
    date: "2025-01-10",
    readTime: "6 min read",
    author: "Marcus Johnson",
  },
  {
    slug: "getting-started-with-credit-trading",
    title: "Getting Started with AI Credit Trading",
    excerpt:
      "A beginner's guide to understanding AI credits, how pricing works, and how to make your first trade on the platform.",
    category: "Tutorials",
    date: "2025-01-08",
    readTime: "10 min read",
    author: "Aisha Patel",
  },
  {
    slug: "new-provider-mistral-ai",
    title: "New Provider: Mistral AI Now Available",
    excerpt:
      "We've added Mistral AI to our supported providers list. Trade Mistral credits alongside OpenAI, Anthropic, and more.",
    category: "Announcements",
    date: "2025-01-05",
    readTime: "3 min read",
    author: "AI Credits Team",
  },
  {
    slug: "understanding-market-depth",
    title: "Understanding Market Depth and Price Discovery",
    excerpt:
      "Learn how our order book works, what market depth means, and how to use it to make better trading decisions.",
    category: "Marketplace",
    date: "2025-01-03",
    readTime: "7 min read",
    author: "David Kim",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page header */}
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          News, guides, and insights about AI credit trading and the AI economy.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Blog posts grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full transition-all hover:ring-2 hover:ring-primary/20 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-snug">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{post.readTime}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <Badge variant="outline" className="cursor-pointer px-3 py-1">
          Previous
        </Badge>
        <Badge className="px-3 py-1">1</Badge>
        <Badge variant="outline" className="cursor-pointer px-3 py-1">
          2
        </Badge>
        <Badge variant="outline" className="cursor-pointer px-3 py-1">
          3
        </Badge>
        <Badge variant="outline" className="cursor-pointer px-3 py-1">
          Next
        </Badge>
      </div>
    </div>
  );
}

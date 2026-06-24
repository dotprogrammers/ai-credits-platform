import { BlogEditor } from "@/components/admin/blog-editor"

const mockPost = {
  title: "Understanding AI Credit Markets",
  slug: "understanding-ai-credit-markets",
  excerpt: "A comprehensive guide to understanding how AI credit markets work, including trading mechanics, pricing models, and market dynamics.",
  content: `AI credit markets represent a new paradigm in how organizations and individuals access artificial intelligence capabilities.

## What are AI Credits?

AI credits are a standardized unit of measurement for accessing AI model capabilities. They allow users to trade, buy, and sell access to various AI services across different providers.

## How Trading Works

The trading platform enables users to:
- Buy credits from providers at competitive rates
- Sell excess credits to other users
- Set limit orders for specific price points
- Participate in bulk auctions

## Market Dynamics

Like any market, AI credit prices are driven by supply and demand. Factors that influence pricing include:

1. **Provider availability** - New model releases can shift supply
2. **Enterprise demand** - Large orders can move prices
3. **Seasonal patterns** - Certain times see higher demand
4. **Regulatory changes** - New regulations can affect availability`,
  category: "guides",
  tags: ["ai-credits", "trading", "guide", "market"],
  status: "published" as const,
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-sm text-muted-foreground">
          Update the blog post content and settings
        </p>
      </div>
      <BlogEditor initialData={mockPost} />
    </div>
  )
}

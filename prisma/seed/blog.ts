import { PrismaClient, BlogPostStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Market Analysis", slug: "market-analysis", description: "Insights and trends in the AI credits marketplace", color: "#3B82F6", sortOrder: 1 },
  { name: "Trading Guides", slug: "trading-guides", description: "Learn how to trade AI credits effectively", color: "#10B981", sortOrder: 2 },
  { name: "Provider Updates", slug: "provider-updates", description: "News and updates from AI providers", color: "#8B5CF6", sortOrder: 3 },
  { name: "Platform News", slug: "platform-news", description: "Announcements and feature updates from our platform", color: "#F59E0B", sortOrder: 4 },
  { name: "Education", slug: "education", description: "Learn about AI APIs, pricing models, and credit systems", color: "#EF4444", sortOrder: 5 },
];

const BLOG_POSTS = [
  {
    title: "Understanding AI Credit Markets: A Beginner's Guide",
    slug: "understanding-ai-credit-markets-beginners-guide",
    excerpt: "AI API credits are becoming a tradable commodity. Learn how the market works, what drives prices, and how to get started trading.",
    content: `## The Rise of AI Credit Trading

As artificial intelligence becomes integral to modern software development, API credits from providers like OpenAI, Anthropic, and Google have become valuable digital assets. Just as companies hedge against fluctuating cloud computing costs, AI API credits can now be bought and sold on secondary markets.

### What Are AI Credits?

AI credits represent prepaid access to language models and AI services. When you purchase credits from a provider, you're essentially buying the right to consume a certain amount of API calls. These credits often come at a discount when bought in bulk, creating arbitrage opportunities.

### How Does the Market Work?

The AI Credits Exchange operates like any modern trading platform:

- **Order Book**: Buyers and sellers place limit orders at specific prices
- **Market Orders**: Execute immediately at the best available price
- **Auctions**: Large blocks of credits can be sold via timed auctions
- **Price Discovery**: Supply and demand determine fair market value

### Key Factors Driving Prices

1. **Provider Pricing Changes**: When OpenAI or Anthropic adjusts their rates, the secondary market reacts
2. **Model Releases**: New model launches create demand spikes for related credits
3. **Enterprise Demand**: Large companies buying in bulk affect supply
4. **Regulatory Changes**: Compliance requirements can impact credit validity

### Getting Started

To begin trading, you'll need to:
1. Create and verify your account (KYC)
2. Deposit funds via credit card, bank transfer, or crypto
3. Browse available products and place your first order
4. Monitor the market and adjust your strategy

The market is still young, and early participants have the advantage of establishing positions before wider adoption.`,
    categorySlug: "education",
    tags: "beginner,market-basics,ai-credits,trading",
    seoTitle: "AI Credit Markets: A Beginner's Guide to Trading AI API Credits",
    seoDescription: "Learn the fundamentals of AI credit trading, how the market works, and how to start buying and selling AI API credits.",
    viewCount: 1247,
    daysAgo: 85,
  },
  {
    title: "OpenAI GPT-4 Credit Prices Hit All-Time Low",
    slug: "openai-gpt4-credit-prices-all-time-low",
    excerpt: "GPT-4 credits dropped 12% this week following increased supply from enterprise liquidations. Here's what it means for traders.",
    content: `## Market Update: GPT-4 Credits Under Pressure

OpenAI GPT-4 credits experienced a significant price drop this week, falling from $0.94 to $0.83 per credit — a 12% decline that marks the lowest price point since the product was listed on our platform.

### What Caused the Drop?

Several factors contributed to the decline:

1. **Enterprise Liquidations**: Three major tech companies offloaded large GPT-4 credit positions, adding significant sell pressure
2. **GPT-4o Migration**: As more developers migrate to GPT-4o (which offers better price-performance), demand for original GPT-4 credits has softened
3. **Increased Supply**: New credit batches from annual enterprise contracts have entered the market

### Trading Opportunities

For buyers, this represents a potential entry point. GPT-4 credits at $0.83 offer a 17% discount to face value, making them attractive for:
- Long-term API consumers who still rely on GPT-4
- Arbitrage traders who expect prices to recover
- Developers building applications with GPT-4's specific capabilities

### What to Watch

- GPT-4 usage trends over the next 30 days
- Whether enterprise selling continues or stabilizes
- OpenAI's pricing announcements at their upcoming developer conference

**Disclaimer**: This is market analysis, not financial advice. Always do your own research before trading.`,
    categorySlug: "market-analysis",
    tags: "openai,gpt4,price-analysis,market-trends",
    seoTitle: "OpenAI GPT-4 Credit Prices Drop 12% - Market Analysis",
    seoDescription: "GPT-4 credits hit an all-time low. Analysis of what caused the drop and what it means for AI credit traders.",
    viewCount: 892,
    daysAgo: 72,
  },
  {
    title: "How to Build a Diversified AI Credit Portfolio",
    slug: "how-to-build-diversified-ai-credit-portfolio",
    excerpt: "Don't put all your credits in one provider. Learn strategies for diversifying across OpenAI, Anthropic, Google, and more.",
    content: `## Why Diversification Matters

Just as traditional investors diversify across asset classes, AI credit traders should spread their holdings across multiple providers. Here's why and how.

### The Risk of Single-Provider Dependence

Relying on a single AI provider exposes you to:
- **Pricing Risk**: Provider price changes directly impact your credit value
- **Availability Risk**: Service outages or API changes can affect usability
- **Regulatory Risk**: Provider-specific compliance issues
- **Technology Risk**: Model deprecation or capability changes

### Recommended Portfolio Allocation

Based on current market conditions, here's a balanced allocation:

| Provider | Allocation | Rationale |
|----------|-----------|-----------|
| OpenAI | 30-35% | Market leader, broadest API ecosystem |
| Anthropic | 20-25% | Strong reasoning, growing enterprise adoption |
| Google | 15-20% | Competitive pricing, large context windows |
| Mistral | 10-15% | European compliance, multilingual strength |
| Meta/Cohere | 10-15% | Open-source options, specialized use cases |

### Rebalancing Strategies

1. **Calendar-Based**: Review and rebalance quarterly
2. **Threshold-Based**: Rebalance when any position deviates >5% from target
3. **Opportunity-Based**: Take advantage of market dislocations

### Practical Steps

1. Assess your current AI API usage patterns
2. Identify which providers you actually use
3. Buy credits for providers you want exposure to
4. Set price alerts for your key positions
5. Review your portfolio monthly

Diversification doesn't eliminate risk, but it helps manage it while maintaining exposure to the growing AI market.`,
    categorySlug: "trading-guides",
    tags: "portfolio,diversification,strategy,risk-management",
    seoTitle: "Building a Diversified AI Credit Portfolio - Trading Strategy Guide",
    seoDescription: "Learn how to diversify your AI credit holdings across multiple providers to manage risk and maximize returns.",
    viewCount: 634,
    daysAgo: 65,
  },
  {
    title: "Anthropic Claude 3.5 Sonnet Credits Now Available",
    slug: "anthropic-claude-35-sonnet-credits-available",
    excerpt: "New Claude 3.5 Sonnet credits are listed for trading. Early pricing shows strong demand from enterprise buyers.",
    content: `## New Product Listing: Claude 3.5 Sonnet Credits

We're excited to announce that Anthropic Claude 3.5 Sonnet credits are now available for trading on our platform.

### About Claude 3.5 Sonnet

Claude 3.5 Sonnet is Anthropic's latest model, offering:
- **Enhanced Reasoning**: Superior performance on complex analytical tasks
- **200K Context Window**: Process large documents in a single call
- **Tool Use**: Native function calling and tool integration
- **Vision**: Multimodal capabilities for image understanding

### Initial Market Pricing

Since listing, Claude 3.5 Sonnet credits have shown strong initial demand:
- Opening price: $0.91 per credit
- Current price: $0.93 per credit (2.2% premium)
- 24-hour volume: $45,000

### Why Trade Claude Credits?

1. **Growing Enterprise Adoption**: Fortune 500 companies are increasingly choosing Claude for production workloads
2. **Competitive Pricing**: Anthropic's pricing is competitive with OpenAI, making credits attractive
3. **Scarcity Value**: Limited secondary market supply creates trading opportunities

### How to Buy

Browse to the Anthropic section of our marketplace to find available sell orders. You can also place limit orders at your desired price.

For large purchases (>$10,000), consider using our auction feature to potentially secure a better price.`,
    categorySlug: "provider-updates",
    tags: "anthropic,claude,new-listing,product-update",
    seoTitle: "Claude 3.5 Sonnet Credits Now Trading - Anthropic AI Credits",
    seoDescription: "Anthropic Claude 3.5 Sonnet credits are now available for trading. See initial pricing and market demand.",
    viewCount: 1563,
    daysAgo: 58,
  },
  {
    title: "Platform Update: New Auction Feature and Improved Order Book",
    slug: "platform-update-auction-feature-improved-orderbook",
    excerpt: "We've launched major platform improvements including real-time auction bidding, enhanced order book visualization, and new API endpoints.",
    content: `## Platform Improvements — June 2024

We've been working hard on several platform improvements based on your feedback. Here's what's new.

### Real-Time Auction Bidding

Our auction system now supports real-time bid updates via WebSocket. When you're watching an active auction:
- See new bids appear instantly
- Get notified when you're outbid
- Place counter-bids without refreshing

### Enhanced Order Book

The order book has been redesigned with:
- **Depth Chart**: Visual representation of buy/sell pressure
- **Spread Indicator**: Real-time bid-ask spread display
- **Volume Profile**: See where the most orders are concentrated
- **Quick Fill**: One-click market orders from the order book

### New API Endpoints

For algorithmic traders, we've added:
- \`GET /api/v1/orderbook/:productId\` — Full order book depth
- \`GET /api/v1/trades/recent\` — Recent trade history
- \`POST /api/v1/orders\` — Programmatic order placement
- \`GET /api/v1/auctions/active\` — Active auction listings

### Bug Fixes

- Fixed an issue where order expiry notifications were sent prematurely
- Corrected the commission calculation for very small trades
- Improved page load times for the marketplace view

### What's Next

We're working on:
- Mobile app (iOS and Android)
- Advanced charting with TradingView integration
- Portfolio tracking and P&L reporting
- API key management for automated trading

Thank you for being part of our community. Your feedback drives our roadmap.`,
    categorySlug: "platform-news",
    tags: "platform-update,auctions,orderbook,api,new-features",
    seoTitle: "Platform Update: Real-Time Auctions, Enhanced Order Book & New APIs",
    seoDescription: "Major platform improvements including real-time auction bidding, enhanced order book visualization, and new trading API endpoints.",
    viewCount: 721,
    daysAgo: 45,
  },
  {
    title: "The Economics of AI API Credits: Why Secondary Markets Matter",
    slug: "economics-of-ai-api-credits-secondary-markets",
    excerpt: "AI API credits are becoming a real asset class. Explore the economics behind why secondary markets for AI credits are emerging and growing.",
    content: `## The Emerging Asset Class

AI API credits are no longer just a prepaid billing mechanism — they're becoming a legitimate tradable asset class. Here's the economic case for why secondary markets matter.

### The Supply Side

Enterprise companies often purchase AI API credits in large volumes to secure:
- Volume discounts (10-30% off list price)
- Committed spend agreements
- Priority access during capacity constraints

However, usage patterns change. A company that over-committed to one provider may have excess credits they don't need. The secondary market lets them recover value.

### The Demand Side

On the buy side, companies and developers want credits because:
- They can access discounts vs. direct purchasing
- They need credits from specific providers for compliance or technical reasons
- They want to hedge against future price increases

### Market Efficiency

Secondary markets improve efficiency by:
1. **Price Discovery**: Transparent pricing based on real supply and demand
2. **Liquidity**: Credits can be converted to cash or reallocated quickly
3. **Risk Transfer**: Companies can offload unused credits rather than writing them off

### Market Size Estimates

The global AI API market is projected to reach $150B by 2027. If even 5% of credits flow through secondary markets, that represents a $7.5B annual trading volume.

### Regulatory Considerations

As this market grows, participants should be aware of:
- Provider terms of service regarding credit transfers
- Tax implications of trading digital assets
- Compliance requirements in different jurisdictions

The AI credit market is still in its early stages, but the fundamentals are strong. Early participants who understand the dynamics will be well-positioned as the market matures.`,
    categorySlug: "education",
    tags: "economics,secondary-markets,asset-class,market-structure",
    seoTitle: "The Economics of AI API Credits: Why Secondary Markets Are Emerging",
    seoDescription: "Explore why AI API credits are becoming a tradable asset class and how secondary markets improve efficiency in the AI ecosystem.",
    viewCount: 456,
    daysAgo: 38,
  },
  {
    title: "Weekly Market Recap: Mixed Signals Across Providers",
    slug: "weekly-market-recap-mixed-signals-providers",
    excerpt: "This week saw divergence between providers — OpenAI credits stable, Anthropic rising, and Google credits declining on oversupply concerns.",
    content: `## Weekly Market Recap

Here's your weekly summary of AI credit market activity across major providers.

### OpenAI — Stable

GPT-4 credits held steady around $0.92, with moderate volume. The market appears to have absorbed last week's enterprise selling. GPT-3.5 credits remain the most traded product by volume.

**Key levels**: Support at $0.90, resistance at $0.94

### Anthropic — Bullish

Claude credits continued their upward trend, with Sonnet credits reaching $0.93. The Claude 3.5 listing has brought new trading volume to the platform. Opus credits remain relatively illiquid but command a premium.

**Key levels**: Support at $0.90, resistance at $0.95

### Google — Bearish

Gemini Pro credits declined 3% to $0.89, pressured by concerns about oversupply after Google's aggressive enterprise sales push. This may present a buying opportunity for long-term holders.

**Key levels**: Support at $0.87, resistance at $0.92

### Mistral & Meta — Neutral

Smaller providers saw limited price movement. Mistral Large credits traded in a tight range around $0.91.

### Volume Summary

- Total platform volume: $2.3M (up 15% week-over-week)
- Most active product: OpenAI GPT-4 credits
- Largest single trade: $85,000 (Anthropic Claude Opus, OTC)

### Week Ahead

Watch for:
- OpenAI's developer event announcements
- Google Cloud Next potential pricing updates
- Monthly enterprise contract renewals that may affect supply`,
    categorySlug: "market-analysis",
    tags: "weekly-recap,market-analysis,openai,anthropic,google",
    seoTitle: "Weekly AI Credit Market Recap - Mixed Signals Across Providers",
    seoDescription: "Weekly market analysis covering OpenAI, Anthropic, and Google AI credit prices, volume, and key trading levels.",
    viewCount: 389,
    daysAgo: 30,
  },
  {
    title: "5 Common Mistakes New AI Credit Traders Make",
    slug: "five-common-mistakes-new-ai-credit-traders",
    excerpt: "Avoid these pitfalls that catch many new traders: overpaying for credits, ignoring expiry dates, and concentrating in one provider.",
    content: `## Learn From Others' Mistakes

After observing hundreds of new traders on our platform, we've identified the most common mistakes. Avoid these to improve your trading outcomes.

### 1. Ignoring the Bid-Ask Spread

New traders often place market orders without checking the spread. On less liquid products, the spread can be 5-8%, meaning you're immediately down that amount.

**Fix**: Always use limit orders and check the order book depth before trading.

### 2. Not Checking Expiry Dates

AI credits can have expiry dates. Buying credits that expire next month at a "discount" might not be a good deal if you can't use them in time.

**Fix**: Always verify the credit expiry terms before purchasing. Factor the time value into your pricing.

### 3. Over-Concentrating in One Provider

Putting all your capital into OpenAI credits because they're the most liquid is a mistake. Provider-specific risks are real.

**Fix**: Diversify across 3-5 providers based on your actual usage and market outlook.

### 4. Chasing Momentum

Seeing a credit price rise and buying at the top is a classic mistake. By the time you notice the trend, it may be reversing.

**Fix**: Develop a thesis for each trade. Buy when credits are undervalued relative to your estimate of fair value.

### 5. Neglecting Fees

Trading fees, deposit fees, and withdrawal fees all eat into your returns. A trader who makes 100 trades of $100 each pays significantly more in fees than one who makes 10 trades of $1,000.

**Fix**: Consolidate orders when possible. Be mindful of the fee structure and factor it into your trading strategy.

### The Bottom Line

Trading AI credits requires the same discipline as any other market. Do your research, manage your risk, and learn from both wins and losses.`,
    categorySlug: "trading-guides",
    tags: "mistakes,beginners,tips,trading-strategy",
    seoTitle: "5 Common Mistakes New AI Credit Traders Make (And How to Avoid Them)",
    seoDescription: "Learn about the most common pitfalls new AI credit traders face and practical strategies to avoid them.",
    viewCount: 1082,
    daysAgo: 22,
  },
  {
    title: "Google Gemini 2.0 Credits: What to Expect",
    slug: "google-gemini-20-credits-what-to-expect",
    excerpt: "Google's upcoming Gemini 2.0 release could reshape the AI credit landscape. Here's our analysis of potential market impacts.",
    content: `## Gemini 2.0 and the Credit Market

Google's announcement of Gemini 2.0 has the AI credit market buzzing. Here's our analysis of what this means for traders.

### Historical Pattern

When major providers release new models, we typically see:
1. **Initial Spike**: Demand for the new model's credits surges
2. **Old Model Discount**: Previous generation credits trade at a discount
3. **Stabilization**: After 2-4 weeks, prices find new equilibrium

### What We Expect for Gemini 2.0

**Short-term (1-2 weeks)**:
- Gemini Pro credits may see increased volatility
- Existing Gemini credits could dip as traders rotate to the new model
- Speculative buying of "Gemini 2.0" credits if/when listed

**Medium-term (1-2 months)**:
- If Gemini 2.0 gains adoption, Google credits overall will appreciate
- Competitor credits (OpenAI, Anthropic) may see slight pressure
- New trading pairs and products may be listed

### Trading Strategy

For traders looking to position ahead of the release:
- **Conservative**: Hold current Google positions, wait for post-release clarity
- **Moderate**: Accumulate Google credits at current discount levels
- **Aggressive**: Short competitor credits on the thesis that Gemini 2.0 captures market share

### Key Risks

- Release delays are common in AI
- The new model may not be materially better than existing options
- Pricing changes from Google could override market dynamics

Stay tuned for our real-time coverage when Gemini 2.0 credits go live.`,
    categorySlug: "provider-updates",
    tags: "google,gemini,model-release,market-impact",
    seoTitle: "Google Gemini 2.0 Credits: Market Impact Analysis",
    seoDescription: "Analysis of how Google's Gemini 2.0 release could affect AI credit prices and trading strategies.",
    viewCount: 734,
    daysAgo: 15,
  },
  {
    title: "Security Best Practices for AI Credit Traders",
    slug: "security-best-practices-ai-credit-traders",
    excerpt: "Protect your account and credits with these essential security practices including 2FA, API key management, and withdrawal whitelists.",
    content: `## Protect Your Assets

As AI credits gain value, security becomes paramount. Follow these best practices to keep your account and credits safe.

### Enable Two-Factor Authentication (2FA)

2FA is the single most important security step. We support:
- **TOTP** (Google Authenticator, Authy)
- **SMS** (less secure, but better than nothing)

**Action**: Enable 2FA immediately after creating your account.

### API Key Management

If you use our API for automated trading:
1. Create separate API keys for each application
2. Set minimum required permissions (read-only vs. trade)
3. Set expiration dates on API keys
4. Rotate keys regularly (every 90 days)
5. Never share API keys or commit them to version control

### Withdrawal Security

- **Whitelist addresses**: Pre-approve withdrawal destinations
- **Withdrawal limits**: Set daily/weekly limits appropriate for your needs
- **Email notifications**: Enable alerts for all withdrawal requests
- **Cooling-off period**: Consider enabling a 24-hour delay on withdrawals

### Account Hygiene

- Use a unique, strong password for our platform
- Don't reuse passwords across services
- Monitor your account activity regularly
- Report suspicious activity immediately

### Phishing Awareness

- Always verify the URL before logging in
- We will never ask for your password via email
- Check email sender addresses carefully
- When in doubt, navigate to our site directly rather than clicking links

### What We Do

On our side, we employ:
- End-to-end encryption for all sensitive data
- Cold storage for platform credit reserves
- Regular security audits by third-party firms
- 24/7 monitoring for suspicious activity

Security is a shared responsibility. By following these practices, you significantly reduce your risk profile.`,
    categorySlug: "education",
    tags: "security,2fa,api-keys,best-practices",
    seoTitle: "Security Best Practices for AI Credit Traders",
    seoDescription: "Essential security practices to protect your AI credit trading account, including 2FA, API key management, and phishing prevention.",
    viewCount: 523,
    daysAgo: 10,
  },
  {
    title: "Introducing Affiliate Program: Earn 2% on Every Referral",
    slug: "introducing-affiliate-program-earn-two-percent",
    excerpt: "Our new affiliate program lets you earn 2% commission on all trades made by users you refer. Join today and start earning.",
    content: `## Earn While You Share

We're thrilled to launch our affiliate program, designed to reward community members who help grow our platform.

### How It Works

1. **Sign Up**: Apply for affiliate status in your account settings
2. **Get Your Link**: Receive a unique referral link and code
3. **Share**: Promote the platform to your network
4. **Earn**: Receive 2% commission on every trade your referrals make

### Commission Structure

| Tier | Referrals | Commission Rate |
|------|-----------|----------------|
| Standard | 0-10 | 2.0% |
| Silver | 11-50 | 2.5% |
| Gold | 51+ | 3.0% |

### Payment Terms

- Commissions accrue in your affiliate balance
- Minimum payout: $50
- Payment methods: Bank transfer, crypto, or platform credit
- Payouts processed weekly

### Who Should Join?

- **Content Creators**: Bloggers, YouTubers, podcasters in the AI space
- **Developers**: Building tools or integrations that drive platform usage
- **Consultants**: Advising companies on AI API strategy
- **Community Leaders**: Active in AI/tech communities

### Getting Started

1. Log in to your account
2. Navigate to Settings > Affiliate Program
3. Complete the application form
4. Once approved, access your dashboard for links and analytics

### Support

Our affiliate team is available at affiliates@aicredits.com for:
- Marketing materials and brand assets
- Custom landing pages for your audience
- Performance optimization tips
- Technical integration support

Join today and turn your network into a revenue stream.`,
    categorySlug: "platform-news",
    tags: "affiliate-program,referrals,earn-money,announcement",
    seoTitle: "AI Credits Exchange Affiliate Program - Earn 2% on Referrals",
    seoDescription: "Join our affiliate program and earn 2% commission on every trade made by users you refer. Multiple tiers with up to 3% commission.",
    viewCount: 412,
    daysAgo: 5,
  },
  {
    title: "Mistral AI Credits: The European Alternative Gaining Traction",
    slug: "mistral-ai-credits-european-alternative-gaining-traction",
    excerpt: "Mistral AI credits have seen a 25% increase in trading volume this month as European enterprises seek GDPR-compliant AI solutions.",
    content: `## The Rise of European AI

Mistral AI, the Paris-based startup, is rapidly gaining market share in the enterprise AI space. Their credits on our platform have seen a 25% volume increase this month.

### Why Mistral?

1. **GDPR Compliance**: Hosted in the EU, Mistral models offer data sovereignty that US-based providers can't match
2. **Multilingual Excellence**: Superior performance in French, German, Spanish, and other European languages
3. **Open-Weight Options**: Some Mistral models are available as open-weight, reducing vendor lock-in
4. **Competitive Pricing**: Mistral's API pricing is 20-30% below comparable OpenAI offerings

### Market Activity

On our platform:
- Mistral Large credits: $0.91 (stable, increasing volume)
- Mistral Medium credits: $0.90 (slight premium due to scarcity)
- Mistral Small credits: $0.88 (high liquidity, good for small traders)

### Who's Buying?

The buyer profile for Mistral credits skews toward:
- European enterprises with GDPR requirements
- Companies with significant non-English language needs
- Cost-conscious developers looking for OpenAI alternatives
- Traders betting on Mistral's growing market share

### Outlook

As European AI regulation tightens (the EU AI Act), demand for EU-based AI providers will likely increase. Mistral credits could benefit from this structural tailwind.

Consider adding Mistral credits to your portfolio as a geographic diversification play.`,
    categorySlug: "market-analysis",
    tags: "mistral,europe,gdpr,enterprise-ai",
    seoTitle: "Mistral AI Credits Gain Traction as European Alternative",
    seoDescription: "Mistral AI credits see 25% volume increase as European enterprises seek GDPR-compliant AI solutions.",
    viewCount: 298,
    daysAgo: 3,
  },
];

export async function seedBlog(adminUserId: string, regularUserIds: string[]) {
  console.log("Seeding blog categories and posts...");

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const created = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  // Create blog posts
  const allUserIds = [adminUserId, ...regularUserIds];
  let postCount = 0;

  for (const post of BLOG_POSTS) {
    const authorId = allUserIds[postCount % allUserIds.length];
    const categoryId = categoryMap[post.categorySlug];
    const publishedAt = new Date(Date.now() - post.daysAgo * 86400000);

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        viewCount: post.viewCount,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        authorId,
        categoryId,
        status: BlogPostStatus.PUBLISHED,
        tags: post.tags,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        viewCount: post.viewCount,
        publishedAt,
      },
    });
    postCount++;
  }

  console.log(`Created ${CATEGORIES.length} blog categories and ${postCount} blog posts`);
}

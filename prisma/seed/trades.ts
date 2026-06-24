import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Seeded pseudo-random number generator
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export async function seedTrades(productIds: Record<string, string>, userIds: string[]) {
  console.log("Seeding trade history...");

  const rand = seededRandom(123);
  const slugs = Object.keys(productIds);
  const trades: any[] = [];

  // Product base prices
  const basePrices: Record<string, number> = {
    "openai-gpt4-credits": 0.925,
    "openai-gpt35-credits": 0.88,
    "openai-dalle-credits": 0.91,
    "openai-embedding-credits": 0.91,
    "anthropic-claude-opus-credits": 0.92,
    "anthropic-claude-sonnet-credits": 0.91,
    "anthropic-claude-haiku-credits": 0.89,
    "google-gemini-pro-credits": 0.92,
    "google-gemini-ultra-credits": 0.92,
    "google-palm-credits": 0.9,
    "mistral-large-credits": 0.91,
    "mistral-medium-credits": 0.9,
    "mistral-small-credits": 0.88,
    "meta-llama3-70b-credits": 0.9,
    "meta-llama3-8b-credits": 0.9,
    "cohere-command-rplus-credits": 0.9,
    "cohere-command-r-credits": 0.9,
    "cohere-embed-credits": 0.9,
  };

  // Generate 120 trades spread over 90 days with increasing volume trend
  const totalTrades = 120;

  for (let i = 0; i < totalTrades; i++) {
    const slug = slugs[Math.floor(rand() * slugs.length)];
    const productId = productIds[slug];
    const basePrice = basePrices[slug] || 0.9;

    // Pick distinct buyer and seller
    let buyerIdx = Math.floor(rand() * userIds.length);
    let sellerIdx = Math.floor(rand() * userIds.length);
    while (sellerIdx === buyerIdx) {
      sellerIdx = Math.floor(rand() * userIds.length);
    }

    // Spread trades over 90 days, with more recent trades being more frequent
    // Use a distribution that clusters toward the present
    const daysAgo = Math.floor(Math.pow(rand(), 1.5) * 90);
    const tradeDate = new Date(Date.now() - daysAgo * 86400000);

    // Price varies slightly around base (market fluctuation)
    const priceVariation = 0.95 + rand() * 0.1; // 95% - 105% of base
    const pricePerUnit = parseFloat((basePrice * priceVariation).toFixed(6));

    // Quantity increases over time (growing volume trend)
    const timeFactor = 1 + (90 - daysAgo) / 90; // 1x to 2x
    const quantity = parseFloat(((20 + rand() * 180) * timeFactor).toFixed(4));

    const totalValue = parseFloat((pricePerUnit * quantity).toFixed(2));
    const buyerFee = parseFloat((totalValue * 0.0025).toFixed(4));
    const sellerFee = parseFloat((totalValue * 0.0025).toFixed(4));

    // Determine source
    const sourceRoll = rand();
    const source = sourceRoll < 0.8 ? "orderbook" : sourceRoll < 0.95 ? "auction" : "otc";

    const trade = await prisma.trade.create({
      data: {
        buyerId: userIds[buyerIdx],
        sellerId: userIds[sellerIdx],
        productId,
        quantity,
        pricePerUnit,
        totalValue,
        buyerFee,
        sellerFee,
        source,
        createdAt: tradeDate,
      },
    });
    trades.push(trade);
  }

  // Sort by date for verification
  trades.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Calculate summary stats
  const totalVolume = trades.reduce((sum, t) => sum + parseFloat(t.totalValue.toString()), 0);
  const avgTradeSize = totalVolume / trades.length;

  console.log(
    `Created ${trades.length} trades over 90 days (total volume: $${totalVolume.toFixed(2)}, avg size: $${avgTradeSize.toFixed(2)})`
  );

  return trades;
}

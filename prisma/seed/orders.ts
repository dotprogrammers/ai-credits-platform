import { PrismaClient, OrderSide, OrderType, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Seeded pseudo-random number generator for deterministic data
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export async function seedOrders(productIds: Record<string, string>, userIds: string[]) {
  console.log("Seeding orders...");

  const rand = seededRandom(42);
  const slugs = Object.keys(productIds);
  const orders: any[] = [];

  // Product base prices (sellPriceUsd / creditAmount = price per credit)
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

  // Focus on top 8 products for order book depth
  const topProducts = slugs.slice(0, 8);

  // Generate BUY orders (bids) - ~110 orders
  for (let i = 0; i < 110; i++) {
    const slug = topProducts[Math.floor(rand() * topProducts.length)];
    const productId = productIds[slug];
    const basePrice = basePrices[slug] || 0.9;
    const userId = userIds[Math.floor(rand() * userIds.length)];

    // Bid prices are below market (discount from base)
    const discount = 0.01 + rand() * 0.08; // 1-9% below market
    const pricePerUnit = parseFloat((basePrice * (1 - discount)).toFixed(6));
    const quantity = parseFloat((10 + rand() * 490).toFixed(4)); // 10-500 credits
    const totalValue = parseFloat((pricePerUnit * quantity).toFixed(2));

    // Mix of order statuses
    let status: OrderStatus = OrderStatus.OPEN;
    const statusRoll = rand();
    if (statusRoll < 0.6) status = OrderStatus.OPEN;
    else if (statusRoll < 0.75) status = OrderStatus.PARTIALLY_FILLED;
    else if (statusRoll < 0.85) status = OrderStatus.FILLED;
    else if (statusRoll < 0.92) status = OrderStatus.CANCELLED;
    else status = OrderStatus.EXPIRED;

    const filledQuantity =
      status === OrderStatus.FILLED ? quantity :
      status === OrderStatus.PARTIALLY_FILLED ? parseFloat((quantity * (0.2 + rand() * 0.6)).toFixed(4)) :
      0;

    const filledValue = parseFloat((filledQuantity * pricePerUnit).toFixed(2));
    const feeUsd = parseFloat((filledValue * 0.0025).toFixed(4));

    const daysAgo = Math.floor(rand() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);
    const expiresAt = new Date(createdAt.getTime() + 30 * 86400000);

    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        side: OrderSide.BUY,
        type: OrderType.LIMIT,
        status,
        pricePerUnit,
        quantity,
        filledQuantity,
        totalValue,
        filledValue,
        feeUsd,
        createdAt,
        expiresAt,
      },
    });
    orders.push(order);
  }

  // Generate SELL orders (asks) - ~110 orders
  for (let i = 0; i < 110; i++) {
    const slug = topProducts[Math.floor(rand() * topProducts.length)];
    const productId = productIds[slug];
    const basePrice = basePrices[slug] || 0.9;
    const userId = userIds[Math.floor(rand() * userIds.length)];

    // Ask prices are above market (premium over base)
    const premium = 0.01 + rand() * 0.08; // 1-9% above market
    const pricePerUnit = parseFloat((basePrice * (1 + premium)).toFixed(6));
    const quantity = parseFloat((10 + rand() * 490).toFixed(4)); // 10-500 credits
    const totalValue = parseFloat((pricePerUnit * quantity).toFixed(2));

    let status: OrderStatus = OrderStatus.OPEN;
    const statusRoll = rand();
    if (statusRoll < 0.6) status = OrderStatus.OPEN;
    else if (statusRoll < 0.75) status = OrderStatus.PARTIALLY_FILLED;
    else if (statusRoll < 0.85) status = OrderStatus.FILLED;
    else if (statusRoll < 0.92) status = OrderStatus.CANCELLED;
    else status = OrderStatus.EXPIRED;

    const filledQuantity =
      status === OrderStatus.FILLED ? quantity :
      status === OrderStatus.PARTIALLY_FILLED ? parseFloat((quantity * (0.2 + rand() * 0.6)).toFixed(4)) :
      0;

    const filledValue = parseFloat((filledQuantity * pricePerUnit).toFixed(2));
    const feeUsd = parseFloat((filledValue * 0.0025).toFixed(4));

    const daysAgo = Math.floor(rand() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);
    const expiresAt = new Date(createdAt.getTime() + 30 * 86400000);

    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        side: OrderSide.SELL,
        type: OrderType.LIMIT,
        status,
        pricePerUnit,
        quantity,
        filledQuantity,
        totalValue,
        filledValue,
        feeUsd,
        createdAt,
        expiresAt,
      },
    });
    orders.push(order);
  }

  // Add some MARKET orders (10 buy, 10 sell)
  for (let i = 0; i < 10; i++) {
    const slug = topProducts[Math.floor(rand() * topProducts.length)];
    const productId = productIds[slug];
    const basePrice = basePrices[slug] || 0.9;
    const userId = userIds[Math.floor(rand() * userIds.length)];

    const pricePerUnit = parseFloat((basePrice * (1 + rand() * 0.02)).toFixed(6));
    const quantity = parseFloat((20 + rand() * 200).toFixed(4));
    const totalValue = parseFloat((pricePerUnit * quantity).toFixed(2));

    await prisma.order.create({
      data: {
        userId,
        productId,
        side: OrderSide.BUY,
        type: OrderType.MARKET,
        status: OrderStatus.FILLED,
        pricePerUnit,
        quantity,
        filledQuantity: quantity,
        totalValue,
        filledValue: totalValue,
        feeUsd: parseFloat((totalValue * 0.0025).toFixed(4)),
        createdAt: new Date(Date.now() - Math.floor(rand() * 7) * 86400000),
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    const slug = topProducts[Math.floor(rand() * topProducts.length)];
    const productId = productIds[slug];
    const basePrice = basePrices[slug] || 0.9;
    const userId = userIds[Math.floor(rand() * userIds.length)];

    const pricePerUnit = parseFloat((basePrice * (1 - rand() * 0.02)).toFixed(6));
    const quantity = parseFloat((20 + rand() * 200).toFixed(4));
    const totalValue = parseFloat((pricePerUnit * quantity).toFixed(2));

    await prisma.order.create({
      data: {
        userId,
        productId,
        side: OrderSide.SELL,
        type: OrderType.MARKET,
        status: OrderStatus.FILLED,
        pricePerUnit,
        quantity,
        filledQuantity: quantity,
        totalValue,
        filledValue: totalValue,
        feeUsd: parseFloat((totalValue * 0.0025).toFixed(4)),
        createdAt: new Date(Date.now() - Math.floor(rand() * 7) * 86400000),
      },
    });
  }

  console.log(`Created ${orders.length + 20} orders (limit + market) across ${topProducts.length} products`);
  return orders;
}

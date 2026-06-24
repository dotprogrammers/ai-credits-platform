import { PrismaClient, AuctionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAuctions(productIds: Record<string, string>, userIds: string[]) {
  console.log("Seeding auctions...");

  const now = new Date();
  const auctions: any[] = [];

  // Auction 1: Active auction with bids (ending soon)
  const a1 = await prisma.auction.create({
    data: {
      sellerId: userIds[0],
      productId: productIds["openai-gpt4-credits"],
      quantity: 500,
      startPrice: 440.0,
      currentPrice: 462.0,
      reservePrice: 430.0,
      status: AuctionStatus.ACTIVE,
      startsAt: new Date(now.getTime() - 20 * 3600000),
      endsAt: new Date(now.getTime() + 4 * 3600000), // ends in 4 hours
      bidCount: 7,
      feeUsd: 1.0,
    },
  });
  auctions.push(a1);

  // Add bids for auction 1
  const bidUsers1 = [userIds[1], userIds[2], userIds[3], userIds[4], userIds[5]];
  let currentBid = 440.0;
  for (let i = 0; i < 7; i++) {
    currentBid += 2 + Math.random() * 5;
    const isWinning = i === 6;
    await prisma.auctionBid.create({
      data: {
        auctionId: a1.id,
        userId: bidUsers1[i % bidUsers1.length],
        amount: parseFloat(currentBid.toFixed(6)),
        quantity: 500,
        isWinning,
        createdAt: new Date(now.getTime() - (7 - i) * 2.5 * 3600000),
      },
    });
  }

  // Auction 2: Active auction (just started)
  const a2 = await prisma.auction.create({
    data: {
      sellerId: userIds[2],
      productId: productIds["anthropic-claude-opus-credits"],
      quantity: 300,
      startPrice: 130.0,
      currentPrice: 138.0,
      reservePrice: 125.0,
      status: AuctionStatus.ACTIVE,
      startsAt: new Date(now.getTime() - 2 * 3600000),
      endsAt: new Date(now.getTime() + 22 * 3600000),
      bidCount: 3,
      feeUsd: 1.0,
    },
  });
  auctions.push(a2);

  for (let i = 0; i < 3; i++) {
    await prisma.auctionBid.create({
      data: {
        auctionId: a2.id,
        userId: userIds[i + 5],
        amount: parseFloat((130 + (i + 1) * 2.5).toFixed(6)),
        quantity: 300,
        isWinning: i === 2,
        createdAt: new Date(now.getTime() - (3 - i) * 40 * 60000),
      },
    });
  }

  // Auction 3: Completed auction
  const a3 = await prisma.auction.create({
    data: {
      sellerId: userIds[4],
      productId: productIds["google-gemini-pro-credits"],
      quantity: 200,
      startPrice: 70.0,
      currentPrice: 76.5,
      reservePrice: 68.0,
      status: AuctionStatus.COMPLETED,
      startsAt: new Date(now.getTime() - 48 * 3600000),
      endsAt: new Date(now.getTime() - 24 * 3600000),
      bidCount: 12,
      feeUsd: 1.0,
    },
  });
  auctions.push(a3);

  // Bids for completed auction
  for (let i = 0; i < 12; i++) {
    await prisma.auctionBid.create({
      data: {
        auctionId: a3.id,
        userId: userIds[i % userIds.length],
        amount: parseFloat((70 + i * 0.55).toFixed(6)),
        quantity: 200,
        isWinning: i === 11,
        createdAt: new Date(now.getTime() - (48 - i * 3.5) * 3600000),
      },
    });
  }

  // Auction 4: Pending auction (starts tomorrow)
  const a4 = await prisma.auction.create({
    data: {
      sellerId: userIds[6],
      productId: productIds["mistral-large-credits"],
      quantity: 150,
      startPrice: 52.0,
      currentPrice: 52.0,
      reservePrice: 50.0,
      status: AuctionStatus.PENDING,
      startsAt: new Date(now.getTime() + 24 * 3600000),
      endsAt: new Date(now.getTime() + 48 * 3600000),
      bidCount: 0,
      feeUsd: 1.0,
    },
  });
  auctions.push(a4);

  // Auction 5: Active auction with many bids (popular)
  const a5 = await prisma.auction.create({
    data: {
      sellerId: userIds[8],
      productId: productIds["openai-gpt4-credits"],
      quantity: 1000,
      startPrice: 880.0,
      currentPrice: 935.0,
      reservePrice: 870.0,
      status: AuctionStatus.ACTIVE,
      startsAt: new Date(now.getTime() - 18 * 3600000),
      endsAt: new Date(now.getTime() + 6 * 3600000),
      bidCount: 15,
      feeUsd: 1.0,
    },
  });
  auctions.push(a5);

  for (let i = 0; i < 15; i++) {
    await prisma.auctionBid.create({
      data: {
        auctionId: a5.id,
        userId: userIds[i % userIds.length],
        amount: parseFloat((880 + (i + 1) * 3.5).toFixed(6)),
        quantity: 1000,
        isWinning: i === 14,
        createdAt: new Date(now.getTime() - (18 - i * 1.1) * 3600000),
      },
    });
  }

  // Auction 6: Expired auction (no bids)
  const a6 = await prisma.auction.create({
    data: {
      sellerId: userIds[10],
      productId: productIds["meta-llama3-70b-credits"],
      quantity: 100,
      startPrice: 42.0,
      currentPrice: 42.0,
      reservePrice: 40.0,
      status: AuctionStatus.EXPIRED,
      startsAt: new Date(now.getTime() - 72 * 3600000),
      endsAt: new Date(now.getTime() - 48 * 3600000),
      bidCount: 0,
      feeUsd: 1.0,
    },
  });
  auctions.push(a6);

  // Auction 7: Cancelled auction
  const a7 = await prisma.auction.create({
    data: {
      sellerId: userIds[3],
      productId: productIds["cohere-command-rplus-credits"],
      quantity: 80,
      startPrice: 48.0,
      currentPrice: 50.0,
      reservePrice: 47.0,
      status: AuctionStatus.CANCELLED,
      startsAt: new Date(now.getTime() - 36 * 3600000),
      endsAt: new Date(now.getTime() - 12 * 3600000),
      bidCount: 4,
      feeUsd: 1.0,
    },
  });
  auctions.push(a7);

  for (let i = 0; i < 4; i++) {
    await prisma.auctionBid.create({
      data: {
        auctionId: a7.id,
        userId: userIds[i + 7],
        amount: parseFloat((48 + (i + 1) * 0.5).toFixed(6)),
        quantity: 80,
        isWinning: i === 3,
        createdAt: new Date(now.getTime() - (36 - i * 6) * 3600000),
      },
    });
  }

  // Auction 8: Active bulk auction (large quantity)
  const a8 = await prisma.auction.create({
    data: {
      sellerId: userIds[12],
      productId: productIds["anthropic-claude-sonnet-credits"],
      quantity: 2000,
      startPrice: 1300.0,
      currentPrice: 1380.0,
      reservePrice: 1280.0,
      status: AuctionStatus.ACTIVE,
      startsAt: new Date(now.getTime() - 10 * 3600000),
      endsAt: new Date(now.getTime() + 14 * 3600000),
      bidCount: 5,
      feeUsd: 1.0,
    },
  });
  auctions.push(a8);

  for (let i = 0; i < 5; i++) {
    await prisma.auctionBid.create({
      data: {
        auctionId: a8.id,
        userId: userIds[i + 2],
        amount: parseFloat((1300 + (i + 1) * 16).toFixed(6)),
        quantity: 2000,
        isWinning: i === 4,
        createdAt: new Date(now.getTime() - (10 - i * 1.8) * 3600000),
      },
    });
  }

  console.log(`Created ${auctions.length} auctions (${auctions.filter(a => a.status === AuctionStatus.ACTIVE).length} active, ${auctions.filter(a => a.status === AuctionStatus.COMPLETED).length} completed, ${auctions.filter(a => a.status === AuctionStatus.PENDING).length} pending, ${auctions.filter(a => a.status === AuctionStatus.EXPIRED).length} expired, ${auctions.filter(a => a.status === AuctionStatus.CANCELLED).length} cancelled)`);

  return auctions;
}

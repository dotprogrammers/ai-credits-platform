import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./users";
import { seedProviders } from "./providers";
import { seedAdmin } from "./admin";
import { seedOrders } from "./orders";
import { seedTrades } from "./trades";
import { seedAuctions } from "./auctions";
import { seedBlog } from "./blog";
import { seedLanding } from "./landing";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AI Credits Platform seed...\n");

  const startTime = Date.now();

  // 1. Admin settings & platform config (no dependencies)
  console.log("── Step 1/7: Admin & Platform Settings ──");
  await seedAdmin();
  console.log("");

  // 2. Users (no dependencies)
  console.log("── Step 2/7: Users ──");
  const { admin, superadmin, regularUsers, affiliateUsers } = await seedUsers();
  console.log("");

  // Collect user IDs for later use
  const regularUserIds = regularUsers.map((u) => u.id);
  const affiliateUserIds = affiliateUsers.map((u) => u.id);
  const allUserIds = [admin.id, superadmin.id, ...regularUserIds, ...affiliateUserIds];

  // 3. Providers & Credit Products (no dependencies)
  console.log("── Step 3/7: Providers & Credit Products ──");
  const productIds = await seedProviders();
  console.log("");

  // 4. Orders (depends on users + products)
  console.log("── Step 4/7: Orders ──");
  await seedOrders(productIds, allUserIds);
  console.log("");

  // 5. Trades (depends on users + products)
  console.log("── Step 5/7: Trades ──");
  await seedTrades(productIds, allUserIds);
  console.log("");

  // 6. Auctions (depends on users + products)
  console.log("── Step 6/7: Auctions ──");
  await seedAuctions(productIds, allUserIds);
  console.log("");

  // 7. Blog & Landing (depends on admin user for blog author)
  console.log("── Step 7/7: Blog & Landing Content ──");
  await seedBlog(admin.id, regularUserIds);
  await seedLanding();
  console.log("");

  // Update platform stats with seed data
  const tradeCount = await prisma.trade.count();
  const totalVolume = await prisma.trade.aggregate({ _sum: { totalValue: true } });
  const uniqueTraders = new Set(
    (await prisma.trade.findMany({ select: { buyerId: true, sellerId: true } })).flatMap((t) => [
      t.buyerId,
      t.sellerId,
    ])
  );
  const totalCredits = await prisma.trade.aggregate({ _sum: { quantity: true } });

  await prisma.platformStats.update({
    where: { id: "singleton" },
    data: {
      totalVolumeUsd: totalVolume._sum.totalValue || 0,
      totalTrades: tradeCount,
      activeTraders: uniqueTraders.size,
      totalCreditsTraded: totalCredits._sum.quantity || 0,
      totalUsers: allUserIds.length,
    },
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("═══════════════════════════════════════");
  console.log(`✅ Seed completed in ${elapsed}s`);
  console.log(`   Users: ${allUserIds.length}`);
  console.log(`   Products: ${Object.keys(productIds).length}`);
  console.log(`   Trades: ${tradeCount}`);
  console.log(`   Total Volume: $${Number(totalVolume._sum.totalValue || 0).toFixed(2)}`);
  console.log(`   Active Traders: ${uniqueTraders.size}`);
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

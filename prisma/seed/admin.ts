import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAdmin() {
  console.log("Seeding admin settings and commission config...");

  // Platform settings
  const settings = [
    {
      key: "platform.name",
      value: "AI Credits Exchange",
      description: "The public-facing name of the platform",
      category: "general",
    },
    {
      key: "platform.description",
      value: "The premier marketplace for trading AI API credits. Buy and sell unused credits from OpenAI, Anthropic, Google, and more.",
      description: "Platform description for SEO and meta tags",
      category: "general",
    },
    {
      key: "platform.supportEmail",
      value: "support@aicredits.com",
      description: "Customer support email address",
      category: "general",
    },
    {
      key: "platform.minDeposit",
      value: 10,
      description: "Minimum deposit amount in USD",
      category: "trading",
    },
    {
      key: "platform.maxDeposit",
      value: 50000,
      description: "Maximum single deposit amount in USD",
      category: "trading",
    },
    {
      key: "platform.minWithdrawal",
      value: 25,
      description: "Minimum withdrawal amount in USD",
      category: "trading",
    },
    {
      key: "platform.minOrderSize",
      value: 5,
      description: "Minimum order size in USD",
      category: "trading",
    },
    {
      key: "platform.maxOrderSize",
      value: 100000,
      description: "Maximum single order size in USD",
      category: "trading",
    },
    {
      key: "platform.orderExpiryDays",
      value: 30,
      description: "Number of days before unfilled orders expire",
      category: "trading",
    },
    {
      key: "platform.auctionDurationHours",
      value: 24,
      description: "Default auction duration in hours",
      category: "trading",
    },
    {
      key: "platform.kycRequired",
      value: true,
      description: "Whether KYC verification is required for trading",
      category: "compliance",
    },
    {
      key: "platform.twoFactorDefault",
      value: false,
      description: "Whether 2FA is enabled by default for new users",
      category: "compliance",
    },
    {
      key: "platform.allowedCountries",
      value: ["US", "UK", "CA", "DE", "FR", "AU", "SG", "JP", "KR", "IN", "IT", "ES", "IE", "AE", "CN", "BR", "NL", "SE", "CH", "NZ"],
      description: "List of allowed country codes for registration",
      category: "compliance",
    },
    {
      key: "platform.featuredProviders",
      value: ["OPENAI", "ANTHROPIC", "GOOGLE"],
      description: "Provider types to feature on the homepage",
      category: "display",
    },
    {
      key: "platform.maintenanceMode",
      value: false,
      description: "Enable maintenance mode to disable trading",
      category: "system",
    },
    {
      key: "platform.announcement",
      value: "",
      description: "Global announcement banner text (empty to disable)",
      category: "display",
    },
    {
      key: "platform.paymentMethods",
      value: {
        creditCard: { enabled: true, minAmount: 10, maxAmount: 5000, feePercent: 2.9 },
        bankTransfer: { enabled: true, minAmount: 100, maxAmount: 50000, feePercent: 0 },
        crypto: { enabled: true, minAmount: 50, maxAmount: 25000, feePercent: 1.0, networks: ["ETH", "BTC", "USDC"] },
      },
      description: "Payment method configuration",
      category: "payments",
    },
  ];

  for (const setting of settings) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
        category: setting.category,
      },
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
      },
    });
  }

  // Commission config
  await prisma.commissionConfig.upsert({
    where: { id: "default-commission" },
    update: {
      tradeCommission: 0.0025,
      auctionFee: 1.0,
      minCommission: 0.01,
      maxCommission: 100.0,
      affiliateRate: 0.02,
      isActive: true,
    },
    create: {
      id: "default-commission",
      tradeCommission: 0.0025, // 0.25%
      auctionFee: 1.0, // $1 flat fee per auction listing
      minCommission: 0.01, // $0.01 minimum
      maxCommission: 100.0, // $100 maximum per trade
      affiliateRate: 0.02, // 2% affiliate commission
      isActive: true,
      effectiveFrom: new Date(),
    },
  });

  // Platform stats singleton
  await prisma.platformStats.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      totalVolumeUsd: 0,
      totalTrades: 0,
      activeTraders: 0,
      totalCreditsTraded: 0,
      totalUsers: 0,
    },
  });

  console.log(`Created ${settings.length} platform settings, commission config, and platform stats`);
}

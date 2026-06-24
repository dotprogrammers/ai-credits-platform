import { PrismaClient, UserRole, AccountStatus, KycStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD_HASH = bcrypt.hashSync("password123", 10);

// Deterministic user definitions
const REGULAR_USERS = [
  { email: "alice@example.com", username: "alice_trader", name: "Alice Chen", country: "US" },
  { email: "bob@example.com", username: "bob_crypto", name: "Bob Martinez", country: "UK" },
  { email: "carol@example.com", username: "carol_ai", name: "Carol Williams", country: "CA" },
  { email: "dave@example.com", username: "dave_dev", name: "Dave Johnson", country: "US" },
  { email: "emma@example.com", username: "emma_quant", name: "Emma Thompson", country: "DE" },
  { email: "frank@example.com", username: "frank_trades", name: "Frank Lee", country: "SG" },
  { email: "grace@example.com", username: "grace_hodl", name: "Grace Kim", country: "KR" },
  { email: "henry@example.com", username: "henry_ml", name: "Henry Patel", country: "IN" },
  { email: "iris@example.com", username: "iris_data", name: "Iris Nakamura", country: "JP" },
  { email: "jack@example.com", username: "jack_openai", name: "Jack O'Brien", country: "IE" },
  { email: "kate@example.com", username: "kate_gpt", name: "Kate Sullivan", country: "AU" },
  { email: "leo@example.com", username: "leo_claude", name: "Leo Rossi", country: "IT" },
  { email: "mia@example.com", username: "mia_gemini", name: "Mia Garcia", country: "ES" },
  { email: "noah@example.com", username: "noah_mistral", name: "Noah Dubois", country: "FR" },
  { email: "olivia@example.com", username: "olivia_llm", name: "Olivia Brown", country: "US" },
  { email: "peter@example.com", username: "peter_api", name: "Peter Schmidt", country: "DE" },
  { email: "quinn@example.com", username: "quinn_credits", name: "Quinn Taylor", country: "CA" },
  { email: "rachel@example.com", username: "rachel_token", name: "Rachel Adams", country: "UK" },
  { email: "sam@example.com", username: "sam_prompt", name: "Sam Wilson", country: "US" },
  { email: "tina@example.com", username: "tina_inference", name: "Tina Zhang", country: "CN" },
];

const AFFILIATE_USERS = [
  { email: "aff_james@example.com", username: "james_affiliate", name: "James Cooper", country: "US", tier: "gold" },
  { email: "aff_sarah@example.com", username: "sarah_partner", name: "Sarah Mitchell", country: "UK", tier: "silver" },
  { email: "aff_marcus@example.com", username: "marcus_ref", name: "Marcus Reed", country: "US", tier: "gold" },
  { email: "aff_lisa@example.com", username: "lisa_promo", name: "Lisa Chang", country: "SG", tier: "standard" },
  { email: "aff_omar@example.com", username: "omar_deals", name: "Omar Hassan", country: "AE", tier: "silver" },
];

export async function seedUsers() {
  console.log("Seeding users...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@aicredits.com" },
    update: {},
    create: {
      email: "admin@aicredits.com",
      username: "admin",
      name: "Platform Admin",
      passwordHash: PASSWORD_HASH,
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
      country: "US",
    },
  });

  // Create superadmin user
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@aicredits.com" },
    update: {},
    create: {
      email: "superadmin@aicredits.com",
      username: "superadmin",
      name: "Super Admin",
      passwordHash: PASSWORD_HASH,
      role: UserRole.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      emailVerified: new Date(),
      country: "US",
    },
  });

  // Create regular users
  const regularUsers = [];
  for (const u of REGULAR_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        name: u.name,
        passwordHash: PASSWORD_HASH,
        role: UserRole.USER,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
        country: u.country,
      },
    });
    regularUsers.push(user);
  }

  // Create affiliate users
  const affiliateUsers = [];
  for (const a of AFFILIATE_USERS) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        username: a.username,
        name: a.name,
        passwordHash: PASSWORD_HASH,
        role: UserRole.AFFILIATE,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
        country: a.country,
      },
    });
    affiliateUsers.push(user);
  }

  // Create wallets for all users
  const allUsers = [admin, superadmin, ...regularUsers, ...affiliateUsers];
  for (const user of allUsers) {
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balanceUsd: 5000 + Math.random() * 15000,
        balanceCredits: 1000 + Math.random() * 5000,
        totalDeposited: 10000 + Math.random() * 40000,
      },
    });
  }

  // Create KYC records for regular users (mix of statuses)
  for (let i = 0; i < regularUsers.length; i++) {
    const statuses: KycStatus[] = [KycStatus.VERIFIED, KycStatus.VERIFIED, KycStatus.VERIFIED, KycStatus.PENDING, KycStatus.NOT_SUBMITTED];
    const status = statuses[i % statuses.length];
    await prisma.kycRecord.upsert({
      where: { userId: regularUsers[i].id },
      update: {},
      create: {
        userId: regularUsers[i].id,
        status,
        fullName: REGULAR_USERS[i].name,
        ...(status === KycStatus.VERIFIED
          ? {
              submittedAt: new Date(Date.now() - 60 * 86400000),
              reviewedAt: new Date(Date.now() - 55 * 86400000),
              reviewedById: admin.id,
            }
          : status === KycStatus.PENDING
          ? { submittedAt: new Date(Date.now() - 5 * 86400000) }
          : {}),
      },
    });
  }

  // Create affiliate profiles
  for (let i = 0; i < affiliateUsers.length; i++) {
    const commissionRates = [0.03, 0.025, 0.03, 0.02, 0.025];
    await prisma.affiliateProfile.upsert({
      where: { userId: affiliateUsers[i].id },
      update: {},
      create: {
        userId: affiliateUsers[i].id,
        commissionRate: commissionRates[i],
        totalReferrals: 5 + i * 3,
        totalEarnings: 500 + i * 200,
        pendingBalance: 50 + i * 30,
        tier: AFFILIATE_USERS[i].tier,
      },
    });
  }

  console.log(
    `Created ${allUsers.length} users (1 admin, 1 superadmin, ${regularUsers.length} regular, ${affiliateUsers.length} affiliates)`
  );

  return { admin, superadmin, regularUsers, affiliateUsers };
}

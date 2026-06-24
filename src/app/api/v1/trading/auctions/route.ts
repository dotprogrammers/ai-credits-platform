import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { createAuctionSchema, paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const status = searchParams.get('status');
    const productId = searchParams.get('productId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (productId) where.productId = productId;

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, slug: true, creditUnit: true } },
          bids: {
            take: 1,
            orderBy: { amount: 'desc' },
            select: { amount: true, userId: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { endsAt: 'asc' },
      }),
      prisma.auction.count({ where }),
    ]);

    return success(auctions, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch auctions');
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = createAuctionSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const product = await prisma.creditProduct.findUnique({
      where: { id: parsed.data.productId, isActive: true },
    });
    if (!product) return error('NOT_FOUND', 'Product not found or inactive');

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    if (wallet.balanceCredits.toNumber() < parsed.data.quantity) {
      return error('INSUFFICIENT_FUNDS', 'Insufficient credit balance');
    }

    const commissionConfig = await prisma.commissionConfig.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });
    const auctionFee = commissionConfig ? Number(commissionConfig.auctionFee) : 1.0;

    const auction = await prisma.$transaction(async (tx) => {
      const newAuction = await tx.auction.create({
        data: {
          sellerId: currentUser.id,
          productId: parsed.data.productId,
          quantity: parsed.data.quantity,
          startPrice: parsed.data.startPrice,
          currentPrice: parsed.data.startPrice,
          reservePrice: parsed.data.reservePrice,
          status: 'PENDING',
          startsAt: new Date(parsed.data.startsAt),
          endsAt: new Date(parsed.data.endsAt),
          feeUsd: auctionFee,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCredits: { decrement: parsed.data.quantity },
          frozenCredits: { increment: parsed.data.quantity },
          balanceUsd: { decrement: auctionFee },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'AUCTION_FEE',
          status: 'COMPLETED',
          amountUsd: auctionFee,
          amountCredits: 0,
          referenceId: newAuction.id,
          referenceType: 'auction',
          description: 'Auction listing fee',
        },
      });

      return newAuction;
    });

    return created(auction);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create auction');
  }
}

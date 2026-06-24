import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { instantTradeSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = instantTradeSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const product = await prisma.creditProduct.findUnique({
      where: { id: parsed.data.productId, isActive: true },
    });
    if (!product) return error('NOT_FOUND', 'Product not found or inactive');

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    const price = parsed.data.side === 'BUY' ? Number(product.sellPriceUsd) : Number(product.faceValueUsd);
    const totalValue = price * parsed.data.quantity;

    if (parsed.data.side === 'BUY' && wallet.balanceUsd.toNumber() < totalValue) {
      return error('INSUFFICIENT_FUNDS', 'Insufficient balance');
    }

    const commissionConfig = await prisma.commissionConfig.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    const commissionRate = commissionConfig ? Number(commissionConfig.tradeCommission) : 0.0025;
    const fee = totalValue * commissionRate;

    const trade = await prisma.$transaction(async (tx) => {
      const newTrade = await tx.trade.create({
        data: {
          buyerId: parsed.data.side === 'BUY' ? currentUser.id : 'system',
          sellerId: parsed.data.side === 'SELL' ? currentUser.id : 'system',
          productId: product.id,
          quantity: parsed.data.quantity,
          pricePerUnit: price,
          totalValue,
          buyerFee: parsed.data.side === 'BUY' ? fee : 0,
          sellerFee: parsed.data.side === 'SELL' ? fee : 0,
          source: 'instant',
        },
      });

      if (parsed.data.side === 'BUY') {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceUsd: { decrement: totalValue + fee },
            balanceCredits: { increment: parsed.data.quantity },
            totalTraded: { increment: totalValue },
          },
        });
      } else {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balanceCredits: { decrement: parsed.data.quantity },
            balanceUsd: { increment: totalValue - fee },
            totalTraded: { increment: totalValue },
          },
        });
      }

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: parsed.data.side === 'BUY' ? 'TRADE_BUY' : 'TRADE_SELL',
          status: 'COMPLETED',
          amountUsd: totalValue,
          amountCredits: parsed.data.quantity,
          creditProvider: product.providerType,
          referenceId: newTrade.id,
          referenceType: 'trade',
          description: `Instant ${parsed.data.side.toLowerCase()} of ${parsed.data.quantity} ${product.creditUnit}`,
        },
      });

      if (fee > 0) {
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'COMMISSION',
            status: 'COMPLETED',
            amountUsd: fee,
            amountCredits: 0,
            referenceId: newTrade.id,
            referenceType: 'commission',
            description: `Trading fee for instant ${parsed.data.side.toLowerCase()}`,
          },
        });
      }

      return newTrade;
    });

    return created(trade);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to execute instant trade');
  }
}

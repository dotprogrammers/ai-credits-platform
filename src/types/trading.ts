import { Decimal } from "@prisma/client/runtime/library";

export interface OrderBookLevel {
  price: Decimal;
  quantity: Decimal;
  total: Decimal;
}

export interface OrderBookSnapshot {
  productId: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: Date;
}

export interface TradeExecution {
  buyOrderId: string;
  sellOrderId: string;
  price: Decimal;
  quantity: Decimal;
  value: Decimal;
  buyerFee: Decimal;
  sellerFee: Decimal;
}

export interface AuctionState {
  auctionId: string;
  currentPrice: Decimal;
  currentBidderId: string | null;
  bidCount: number;
  endsAt: Date;
}

export interface PriceLevel {
  price: Decimal;
  volume: Decimal;
  orderCount: number;
}

export interface MarketStats {
  lastPrice: Decimal | null;
  high24h: Decimal;
  low24h: Decimal;
  volume24h: Decimal;
  spread: Decimal;
}

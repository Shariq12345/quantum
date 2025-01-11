// src/types/market.ts
export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  region: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
}

export interface MarketStats {
  advancing: number;
  declining: number;
  unchanged: number;
}

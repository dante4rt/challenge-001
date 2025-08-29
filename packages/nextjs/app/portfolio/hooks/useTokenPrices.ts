"use client";

import { useState, useEffect } from "react";

interface Token {
  symbol: string;
}

interface TokenPrices {
  [symbol: string]: number;
}

export const useTokenPrices = (tokens: Token[]) => {
  const [prices, setPrices] = useState<TokenPrices>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockPrices: TokenPrices = {
          ETH: 2450.32,
          ARB: 0.85,
          USDC: 1.001,
          WETH: 2450.32,
          USDT: 0.999,
        };

        setPrices(mockPrices);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, [tokens]);

  return { prices, isLoading };
};

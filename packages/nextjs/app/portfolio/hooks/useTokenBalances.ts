"use client";

import { useState, useEffect, useCallback } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import deployedContracts from "../../../contracts/deployedContracts";

interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

interface TokenBalances {
  [address: string]: bigint;
}

export const useTokenBalances = (userAddress: string | undefined, tokens: Token[]) => {
  const [balances, setBalances] = useState<TokenBalances>({});
  const [batchedTime, setBatchedTime] = useState(0);
  const [individualTime, setIndividualTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get contract info for PortfolioReader
  const portfolioReaderContract = deployedContracts[421614]?.PortfolioReader;

  // Batched call using our PortfolioReader contract
  const { data: batchedData, refetch: refetchBatched } = useReadContract({
    address: portfolioReaderContract?.address as `0x${string}`,
    abi: portfolioReaderContract?.abi,
    functionName: "getUserPortfolio",
    args: [userAddress as `0x${string}`, tokens.map(token => token.address as `0x${string}`)],
    query: {
      enabled: !!userAddress && tokens.length > 0 && !!portfolioReaderContract,
    },
  });

  // Individual calls for comparison
  const individualContracts = tokens.map(token => ({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  }));

  const { refetch: refetchIndividual } = useReadContracts({
    contracts: individualContracts,
    query: {
      enabled: !!userAddress && tokens.length > 0,
    },
  });

  // Simulate individual calls timing
  const simulateIndividualCalls = useCallback(async () => {
    if (!userAddress || tokens.length === 0) return;

    const startTime = performance.now();

    // Simulate the time it would take for individual calls
    await new Promise(resolve => setTimeout(resolve, tokens.length * 100));

    const endTime = performance.now();
    setIndividualTime(endTime - startTime);
  }, [userAddress, tokens]);

  useEffect(() => {
    if (batchedData && userAddress) {
      const startTime = performance.now();

      const newBalances: TokenBalances = {};

      // Parse the returned TokenBalance structs from PortfolioReader
      if (Array.isArray(batchedData)) {
        batchedData.forEach((tokenBalance: any, index: number) => {
          if (tokenBalance && tokenBalance.length >= 2) {
            // TokenBalance struct: [address, balance, decimals, symbol]
            const [, balance] = tokenBalance;
            newBalances[tokens[index].address] = balance as bigint;
          }
        });
      }

      const endTime = performance.now();
      setBatchedTime(endTime - startTime);
      setBalances(newBalances);

      // Simulate individual calls for performance comparison
      simulateIndividualCalls();
    }
  }, [batchedData, userAddress, tokens, simulateIndividualCalls]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([refetchBatched(), refetchIndividual()]);
    setIsLoading(false);
  }, [refetchBatched, refetchIndividual]);

  return {
    balances,
    isLoading,
    refetch,
    batchedTime,
    individualTime,
  };
};

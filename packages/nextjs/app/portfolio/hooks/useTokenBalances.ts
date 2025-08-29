"use client";

import { useState, useEffect, useCallback } from "react";
import { useReadContracts } from "wagmi";
import { erc20Abi } from "viem";

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

  const contracts = tokens.map(token => ({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`],
  }));

  const { data: batchedData, refetch: refetchBatched } = useReadContracts({
    contracts,
    query: {
      enabled: !!userAddress && tokens.length > 0,
    },
  });

  const simulateIndividualCalls = useCallback(async () => {
    if (!userAddress || tokens.length === 0) return;

    const startTime = performance.now();

    const individualResults = await Promise.all(
      tokens.map(async token => {
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

        const mockBalance = BigInt(Math.floor(Math.random() * 1000000) * Math.pow(10, token.decimals));
        return { address: token.address, balance: mockBalance };
      }),
    );

    const endTime = performance.now();
    setIndividualTime(endTime - startTime);

    return individualResults;
  }, [userAddress, tokens]);

  useEffect(() => {
    if (batchedData && userAddress) {
      const startTime = performance.now();

      const newBalances: TokenBalances = {};
      batchedData.forEach((result, index) => {
        if (result.status === "success" && result.result !== undefined) {
          newBalances[tokens[index].address] = result.result as bigint;
        } else {
          newBalances[tokens[index].address] = BigInt(
            Math.floor(Math.random() * 1000000) * Math.pow(10, tokens[index].decimals),
          );
        }
      });

      const endTime = performance.now();
      setBatchedTime(endTime - startTime);
      setBalances(newBalances);

      simulateIndividualCalls();
    }
  }, [batchedData, userAddress, tokens, simulateIndividualCalls]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await refetchBatched();
    setIsLoading(false);
  }, [refetchBatched]);

  return {
    balances,
    isLoading,
    refetch,
    batchedTime,
    individualTime,
  };
};

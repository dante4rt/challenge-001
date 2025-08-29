"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { LinkIcon } from "@heroicons/react/24/outline";
import { TokenCard } from "./TokenCard";
import { RefreshButton } from "./RefreshButton";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { TotalValueCard } from "./TotalValueCard";
import { useTokenPrices } from "../hooks/useTokenPrices";
import { useTokenBalances } from "../hooks/useTokenBalances";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: bigint;
  price?: number;
  icon?: string;
}

const DEMO_TOKENS: Token[] = [
  {
    address: "0xA0b86a33E6441D65D5DACE1Ab4b5AAbE37b5A8b0",
    symbol: "ARB",
    name: "Arbitrum",
    decimals: 18,
    icon: "CircleStackIcon",
  },
  {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "CurrencyDollarIcon",
  },
  {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    icon: "SparklesIcon",
  },
  {
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    icon: "CheckCircleIcon",
  },
];

interface PortfolioDashboardProps {
  isDarkMode: boolean;
}

export const PortfolioDashboard = ({ isDarkMode }: PortfolioDashboardProps) => {
  const { address } = useAccount();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBatchedComparison, setShowBatchedComparison] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    batchedTime: 0,
    individualTime: 0,
    batchedCalls: 1,
    individualCalls: 0,
  });

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { prices, isLoading: pricesLoading } = useTokenPrices(DEMO_TOKENS);
  const {
    balances,
    isLoading: balancesLoading,
    refetch: refetchBalances,
    batchedTime,
    individualTime,
  } = useTokenBalances(address, DEMO_TOKENS);

  const isLoading = pricesLoading || balancesLoading;

  const totalValue = DEMO_TOKENS.reduce((total, token) => {
    const balance = balances[token.address];
    const price = prices[token.symbol];
    if (balance && price) {
      const tokenValue = (Number(balance) / Math.pow(10, token.decimals)) * price;
      return total + tokenValue;
    }
    return total;
  }, 0);

  const ethValue = ethBalance && prices.ETH ? (Number(ethBalance.value) / Math.pow(10, 18)) * prices.ETH : 0;

  const totalPortfolioValue = totalValue + ethValue;

  useEffect(() => {
    if (batchedTime > 0 || individualTime > 0) {
      setPerformanceData({
        batchedTime,
        individualTime,
        batchedCalls: 1,
        individualCalls: DEMO_TOKENS.length,
      });
    }
  }, [batchedTime, individualTime]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchBalances();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetchBalances]);

  const toggleComparison = useCallback(() => {
    setShowBatchedComparison(!showBatchedComparison);
  }, [showBatchedComparison]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <RefreshButton onClick={handleRefresh} isLoading={isRefreshing} isDarkMode={isDarkMode} />
          <button
            onClick={toggleComparison}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              showBatchedComparison
                ? "bg-blue-500 text-white shadow-lg"
                : isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showBatchedComparison ? "Hide" : "Show"} Performance
          </button>
        </div>

        {address && (
          <div
            className={`text-sm px-3 py-1 rounded-full ${
              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}
          >
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBatchedComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <PerformanceMetrics data={performanceData} isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>

      <TotalValueCard totalValue={totalPortfolioValue} isLoading={isLoading} isDarkMode={isDarkMode} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TokenCard
          token={{
            address: "ETH",
            symbol: "ETH",
            name: "Ethereum",
            decimals: 18,
            icon: "BoltIcon",
          }}
          balance={ethBalance?.value}
          price={prices.ETH}
          isLoading={!ethBalance || pricesLoading}
          isDarkMode={isDarkMode}
        />

        {DEMO_TOKENS.map(token => (
          <TokenCard
            key={token.address}
            token={token}
            balance={balances[token.address]}
            price={prices[token.symbol]}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {!address && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center p-8 rounded-xl border-2 border-dashed ${
            isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
          }`}
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto">
            <LinkIcon className={`w-16 h-16 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p>Connect your wallet to view your portfolio balances and values</p>
        </motion.div>
      )}
    </div>
  );
};

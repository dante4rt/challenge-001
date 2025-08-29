"use client";

import { motion } from "framer-motion";
import { formatUnits } from "viem";
import {
  CircleStackIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckCircleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
}

interface TokenCardProps {
  token: Token;
  balance?: bigint;
  price?: number;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const TokenCard = ({ token, balance, price, isLoading, isDarkMode }: TokenCardProps) => {
  const renderIcon = (iconName?: string) => {
    const iconClass = `w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`;

    switch (iconName) {
      case "CircleStackIcon":
        return <CircleStackIcon className={iconClass} />;
      case "CurrencyDollarIcon":
        return <CurrencyDollarIcon className={iconClass} />;
      case "SparklesIcon":
        return <SparklesIcon className={iconClass} />;
      case "CheckCircleIcon":
        return <CheckCircleIcon className={iconClass} />;
      case "BoltIcon":
        return <BoltIcon className={iconClass} />;
      default:
        return <CircleStackIcon className={iconClass} />;
    }
  };

  const formatBalance = (bal: bigint, decimals: number) => {
    const formatted = formatUnits(bal, decimals);
    const num = parseFloat(formatted);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    if (num >= 1) return num.toFixed(4);
    return num.toFixed(8);
  };

  const formatPrice = (p: number) => {
    if (p >= 1000) return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (p >= 1) return `$${p.toFixed(4)}`;
    return `$${p.toFixed(8)}`;
  };

  const calculateValue = () => {
    if (!balance || !price) return 0;
    return Number(formatUnits(balance, token.decimals)) * price;
  };

  const value = calculateValue();
  const hasData = balance !== undefined && price !== undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-xl p-4 sm:p-6 border transition-all duration-200
        ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            {renderIcon(token.icon)}
            <div>
              <div className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {token.symbol}
              </div>
              <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{token.name}</div>
            </div>
          </div>

          <div className="text-right">
            {isLoading ? (
              <div className={`h-4 w-12 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            ) : price ? (
              <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {formatPrice(price)}
              </div>
            ) : (
              <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>No price</div>
            )}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>BALANCE</div>
            {isLoading ? (
              <div
                className={`h-6 sm:h-7 w-20 sm:w-24 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              />
            ) : balance ? (
              <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {formatBalance(balance, token.decimals)}
              </div>
            ) : (
              <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                0.00
              </div>
            )}
          </div>

          <div>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>VALUE</div>
            {isLoading ? (
              <div
                className={`h-5 sm:h-6 w-16 sm:w-20 rounded animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              />
            ) : hasData && value > 0 ? (
              <div className="text-base sm:text-lg font-semibold text-green-500">
                ${value >= 1000 ? `${(value / 1000).toFixed(2)}K` : value.toFixed(2)}
              </div>
            ) : (
              <div className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                $0.00
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

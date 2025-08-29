"use client";

import { motion } from "framer-motion";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface TotalValueCardProps {
  totalValue: number;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const TotalValueCard = ({ totalValue, isLoading, isDarkMode }: TotalValueCardProps) => {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden rounded-2xl sm:rounded-3xl pt-6 sm:pt-8 px-4 sm:px-8 pb-12 sm:pb-16 mb-6 sm:mb-8 shadow-xl backdrop-blur-sm border
        ${
          isDarkMode
            ? "bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-700/30"
            : "bg-gradient-to-br from-purple-50/80 to-blue-50/60 border-purple-200/30"
        }
      `}
    >
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div
          className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full opacity-20 blur-xl ${
            isDarkMode ? "bg-purple-500" : "bg-purple-300"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-18 h-18 sm:w-24 sm:h-24 rounded-full opacity-20 blur-xl ${
            isDarkMode ? "bg-blue-500" : "bg-blue-300"
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={isLoading ? { rotate: [0, 360] } : {}}
              transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <CurrencyDollarIcon
                className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
              />
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">Total Portfolio Value</h2>
              <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                All tokens combined
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-3 sm:py-4">
          {isLoading ? (
            <div className="space-y-2 sm:space-y-3">
              <div
                className={`h-10 sm:h-12 w-40 sm:w-48 mx-auto rounded-lg animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              />
              <div
                className={`h-3 sm:h-4 w-28 sm:w-32 mx-auto rounded animate-pulse ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}
              />
            </div>
          ) : (
            <motion.div
              key={totalValue}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {formatValue(totalValue)}
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Portfolio balance</div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="absolute -bottom-4 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

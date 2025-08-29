"use client";

import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const RefreshButton = ({ onClick, isLoading, isDarkMode }: RefreshButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden h-[42px] px-4 py-2 rounded-lg font-medium
        transition-all duration-300 flex items-center gap-2
        ${isLoading ? "cursor-not-allowed opacity-70" : "hover:shadow-lg"}
        ${
          isDarkMode
            ? "bg-blue-900/50 text-blue-300 border border-blue-700/50 hover:bg-blue-800/60"
            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
        }
      `}
    >
      <motion.div
        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
        transition={{
          duration: 1,
          repeat: isLoading ? Infinity : 0,
          ease: "linear",
        }}
        className="flex items-center justify-center"
      >
        <ArrowPathIcon className="w-5 h-5" />
      </motion.div>
      <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
    </motion.button>
  );
};

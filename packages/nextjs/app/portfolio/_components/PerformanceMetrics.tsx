"use client";

import { motion } from "framer-motion";
import { BoltIcon, RocketLaunchIcon, ClockIcon } from "@heroicons/react/24/outline";

interface PerformanceData {
  batchedTime: number;
  individualTime: number;
  batchedCalls: number;
  individualCalls: number;
}

interface PerformanceMetricsProps {
  data: PerformanceData;
  isDarkMode: boolean;
}

export const PerformanceMetrics = ({ data, isDarkMode }: PerformanceMetricsProps) => {
  const efficiency =
    data.individualTime > 0 ? ((data.individualTime - data.batchedTime) / data.individualTime) * 100 : 0;

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-2xl p-6 border shadow-lg backdrop-blur-sm
        ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-700/30"
            : "bg-gradient-to-br from-blue-50/80 to-purple-50/60 border-blue-200/30"
        }
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BoltIcon className="w-6 h-6 text-yellow-500" />
          Performance Comparison
        </h3>

        {efficiency > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              px-3 py-1 rounded-full text-sm font-semibold
              ${
                efficiency > 50
                  ? "bg-green-500/20 text-green-600 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
              }
            `}
          >
            {efficiency.toFixed(1)}% faster
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            p-4 rounded-xl border
            ${isDarkMode ? "bg-green-900/20 border-green-700/30" : "bg-green-50/80 border-green-200/50"}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-green-600 flex items-center gap-2">
              <RocketLaunchIcon className="w-5 h-5" />
              Batched Calls
            </h4>
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {data.batchedCalls} call{data.batchedCalls !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Response Time</span>
              <span className="text-lg font-bold text-green-600">{formatTime(data.batchedTime)}</span>
            </div>

            <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : ""}`}>
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            p-4 rounded-xl border
            ${isDarkMode ? "bg-orange-900/20 border-orange-700/30" : "bg-orange-50/80 border-orange-200/50"}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-orange-600 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Individual Calls
            </h4>
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {data.individualCalls} call{data.individualCalls !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Response Time</span>
              <span className="text-lg font-bold text-orange-600">{formatTime(data.individualTime)}</span>
            </div>

            <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : ""}`}>
              <motion.div
                className="bg-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width:
                    data.individualTime > data.batchedTime
                      ? "100%"
                      : `${(data.individualTime / Math.max(data.batchedTime, data.individualTime)) * 100}%`,
                }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`
          mt-6 p-4 rounded-xl border
          ${isDarkMode ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-50/80 border-gray-200/50"}
        `}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Calls Saved</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(0, data.individualCalls - data.batchedCalls)}
            </div>
          </div>

          <div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Time Saved</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(Math.max(0, data.individualTime - data.batchedTime))}
            </div>
          </div>

          <div>
            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Efficiency</div>
            <div className="text-2xl font-bold text-green-600">{efficiency.toFixed(1)}%</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

"use client";

import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { PortfolioDashboard } from "./_components/PortfolioDashboard";

const Portfolio: NextPage = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="min-h-screen pt-6 sm:pt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Dashboard
          </h1>
          <p className="text-base sm:text-lg opacity-75 max-w-2xl mx-auto px-4">
            Track your token balances and portfolio value with efficient batched reads
          </p>
        </div>

        <PortfolioDashboard isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Portfolio;

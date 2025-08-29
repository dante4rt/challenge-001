import React from "react";
import { useTheme } from "next-themes";

export const BackGround = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  if (!isDarkMode) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] sm:h-[50vh] sm:w-[50vh] lg:h-[70vh] lg:w-[70vh] rounded-full -z-50"
        style={{
          backgroundColor: "rgba(230, 15, 119, 0.33)",
          filter: "blur(254.85px)",
        }}
      />
      <div
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[500px] lg:h-[500px] xl:w-[630px] xl:h-[630px] rounded-full -z-50"
        style={{
          backgroundColor: "#224457",
          filter: "blur(164.85px)",
        }}
      />
      <div
        className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[500px] lg:h-[500px] xl:w-[630px] xl:h-[630px] rounded-full -z-50"
        style={{
          backgroundColor: "#252525",
          filter: "blur(274.85px)",
        }}
      />
    </div>
  );
};

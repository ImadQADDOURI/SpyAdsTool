// @/components/adLibrary/microComponents/Loading.tsx
// You can use this component in various ways:

// 1. With Suspense:
// <Suspense fallback={<Loading message="Loading content..." />}> <SomeAsyncComponent /> </Suspense>
// 2. As a standalone loading indicator:
// if (isLoading) {return <Loading { message?: string;  size?: "small" | "medium" | "large";}/>;}

import React from "react";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export function Loading({ message, size = "medium" }: LoadingProps) {
  const sizeClasses = {
    small: "h-8 w-8 border-2",
    medium: "h-12 w-12 border-3",
    large: "h-16 w-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div
          className={`rounded-full ${sizeClasses[size]} animate-spin`}
          style={{
            borderColor: "#B977F8 transparent #6566F1 transparent",
          }}
        ></div>
        <div
          className={`absolute left-0 top-0 rounded-full ${sizeClasses[size]} animate-pulse`}
          style={{
            backgroundImage: "linear-gradient(to right, #6566F1, #B977F8)",
            opacity: 0.2,
          }}
        ></div>
      </div>
      {message && (
        <p className="mt-4 animate-pulse bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-semibold text-transparent">
          {message}
        </p>
      )}
    </div>
  );
}

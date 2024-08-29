// src/components/ui/Skeleton.js
// src/components/Skeletons.js
import React from 'react';
import { Skeleton } from "./skeleton";

export const SkeletonButton = ({ className }) => {
  return (
    <div className="space-y-2 mt-2 mb-2 w-full">
      <Skeleton
        className={`h-14 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white ${className}`}
        style={{
          padding: "12px 16px",
          width: "100%",
          marginBottom: "3px",
          textAlign: "left",
          wordBreak: "break-word",
          borderRadius: "5px",
          fontSize: "14px",
          border: "1px solid transparent", // Ensures correct height
        }}
      />
    </div>
  );
};


export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
export function SkeletonDetails() {
  return (
    <div className="space-y-4" style={{ padding: "30px", fontSize: "17px" }}>
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-48" />
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-40" />
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-52" />
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-44" />
      <Skeleton className="h-8 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-32" />
      <Skeleton className="h-10 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-full" />
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-48" />
      <Skeleton className="h-6 bg-gray-300 animate-pulse dark:bg-[#1c1c1c] bg-white w-48" />
    </div>
  );
}


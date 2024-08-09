// src/components/ui/Skeleton.js
import React from 'react';

export const SkeletonButton = ({ className }) => {
  return (
    <div className="space-y-2 mt-2 mb-2 w-full">
      <button
        className={`bg-gray-300 animate-pulse h-14 dark:bg-[#1c1c1c] bg-white ${className}`}
        style={{
          padding: "12px 16px",
          width: "100%",
          marginBottom: "3px",
          textAlign: "left",
          wordBreak: "break-word",
          borderRadius: "5px",
          fontSize: "14px",
          border: '1px solid transparent', // Ensures correct height
        }}
      ></button>
    </div>
  );
};

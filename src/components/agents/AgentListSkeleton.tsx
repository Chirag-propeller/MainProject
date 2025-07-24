// AgentListSkeleton.tsx
import React from "react";

export default function AgentListSkeleton() {
  return (
    <div className="w-full border-gray-200 dark:border-gray-800 border-t-0 flex flex-col bg-white dark:bg-gray-900 p-3">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-8 w-20 bg-indigo-200 dark:bg-indigo-700 rounded" />
      </div>
      {/* List skeletons */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="p-2 px-2 border border-gray-200 dark:border-gray-700 rounded-[6px] mb-2 bg-white dark:bg-gray-900 animate-pulse flex justify-between items-center"
        >
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            {/* Pin icon skeleton */}
            <div className="h-3 w-3 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

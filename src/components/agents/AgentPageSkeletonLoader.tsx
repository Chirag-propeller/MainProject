import React from "react";

const SkeletonBar = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} animate-pulse`}
  />
);

const SkeletonSection = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 p-4">
    <div className="flex items-center gap-3">
      <SkeletonBar width="w-10 h-10" />
      <div>
        <SkeletonBar width="w-32" />
        <SkeletonBar width="w-24 mt-2" />
      </div>
    </div>
    <SkeletonBar width="w-full mt-4 h-3" />
  </div>
);

const AgentPageSkeletonLoader = () => (
  <div className="p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <SkeletonBar width="w-40 h-7" />
        <SkeletonBar width="w-56 h-4 mt-2" />
      </div>
      <div className="flex gap-3">
        <SkeletonBar width="w-20 h-8" />
        <SkeletonBar width="w-16 h-8" />
      </div>
    </div>

    {/* Tabs */}
    <div className="flex gap-4 mb-6">
      <SkeletonBar width="w-20 h-6" />
      <SkeletonBar width="w-20 h-6" />
    </div>

    {/* Cost per minute */}
    <div className="mb-6">
      <div className="flex gap-4 mb-2">
        <SkeletonBar width="w-16 h-4" />
        <SkeletonBar width="w-16 h-4" />
        <SkeletonBar width="w-16 h-4" />
        <SkeletonBar width="w-16 h-4" />
      </div>
      <div className="flex justify-between mb-2">
        <SkeletonBar width="w-32 h-4" />
        <SkeletonBar width="w-32 h-4" />
      </div>
      <SkeletonBar width="w-full h-3" />
    </div>

    {/* Sections */}
    <SkeletonSection />
    <SkeletonSection />
    <SkeletonSection />
    <SkeletonSection />
    <SkeletonSection />
  </div>
);

export default AgentPageSkeletonLoader;

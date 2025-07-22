import React from "react";

const SideBarCell = ({
  title,
  value,
}: {
  title: string;
  value: string | boolean | number;
}) => {
  const isSummary = title === "Summary";
  return (
    <div className="flex flex-row gap-1">
      <h2 className="text-xs text-black dark:text-gray-300">{title}: </h2>
      <p className={`text-xs ${isSummary ? "italic" : ""} dark:text-gray-300`}>
        {value === false ? "false" : value}
      </p>
    </div>
  );
};

export default SideBarCell;

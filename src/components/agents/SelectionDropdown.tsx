import React from "react";

interface SelectionDropdownProps {
  options: { name: string; value: string }[]; // List of options
  selectedOption: string; // Current selected option
  setOption: React.Dispatch<React.SetStateAction<string>>; // Function to update the selected option
  loading?: boolean;
}

const SelectionDropdown: React.FC<SelectionDropdownProps> = ({
  options,
  selectedOption,
  setOption,
  loading,
}) => {
  return (
    <div>
      <select
        className="p-2.25 rounded-[6px] w-full text-sm bg-white border border-gray-300 "
        value={selectedOption}
        onChange={(e) => setOption(e.target.value)}
      >
        {options.length > 0 ? (
          options?.map((option: any, idx: any) => (
            <option key={idx} value={option.value} className="p-2">
              {" "}
              {option.name}{" "}
            </option>
          ))
        ) : (
          <option value="">No options available</option>
        )}
      </select>
    </div>
  );
};

export default SelectionDropdown;

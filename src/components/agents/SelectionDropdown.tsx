"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import React from "react";

interface SelectionDropdownProps {
  options: { name: string; value: string }[];
  selectedOption: string;
  setOption: React.Dispatch<React.SetStateAction<string>>;
  loading?: boolean;
  className?: string;
}

const SelectionDropdown: React.FC<SelectionDropdownProps> = ({
  options,
  selectedOption,
  setOption,
  loading,
  className = "",
}) => {
  return (
    <Select value={selectedOption} onValueChange={setOption}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent sideOffset={4} side="bottom">
        {options.map((option) =>
          option.value ? (
            <SelectItem key={option.value} value={option.value}>
              {option.name}
            </SelectItem>
          ) : null
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectionDropdown;

// import React from "react";

// interface SelectionDropdownProps {
//   options: { name: string; value: string }[]; // List of options
//   selectedOption: string; // Current selected option
//   setOption: React.Dispatch<React.SetStateAction<string>>; // Function to update the selected option
//   loading?: boolean;
//   className?: string;
// }

// const SelectionDropdown: React.FC<SelectionDropdownProps> = ({
//   options,
//   selectedOption,
//   setOption,
//   loading,
//   className,
// }) => {
//   return (
//     <div>
//       <select
//         className={`block w-full appearance-none border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm rounded-[6px]
//     bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93bi1pY29uIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==")]
//     bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]
//     ${className}`}
//         value={selectedOption}
//         onChange={(e) => setOption(e.target.value)}
//       >
//         {options.length > 0 ? (
//           options?.map((option: any, idx: any) => (
//             <option
//               key={idx}
//               value={option.value}
//               className="p-2 focus:hover:bg-gray-200"
//             >
//               {" "}
//               {option.name}{" "}
//             </option>
//           ))
//         ) : (
//           <option value="">No options available</option>
//         )}
//       </select>
//     </div>
//   );
// };

// export default SelectionDropdown;

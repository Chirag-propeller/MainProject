// TooltipLabel.tsx
import { IoAlertCircleOutline } from "react-icons/io5";
import { tooltipDescriptions } from "../../../public/data/tooltip-info";

interface TooltipLabelProps {
  label: string;
  fieldKey: string;
  htmlFor?: string;
  className?: string;
  position?: "top" | "bottom";
}

const TooltipLabel: React.FC<TooltipLabelProps> = ({
  label,
  fieldKey,
  htmlFor,
  className,
  position,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`flex items-center gap-1 text-sm font-medium text-black dark:text-white mb-1 ${className}`}
    >
      {label}
      {tooltipDescriptions[fieldKey] && (
        <div className="relative group">
          <span className="text-gray-400 dark:text-gray-300 cursor-pointer">
            <IoAlertCircleOutline className={`w-4 h-4`} />
          </span>
          <div
            className={`absolute z-10 hidden group-hover:block bg-gray-50 dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm text-xs rounded py-1 px-2 ${position === "bottom" ? "top-full font-light" : "bottom-full"} transform mb-2 w-[250px] max-w-[300px] break-words leading-tight`}
          >
            {tooltipDescriptions[fieldKey]}
          </div>
        </div>
      )}
    </label>
  );
};

export default TooltipLabel;

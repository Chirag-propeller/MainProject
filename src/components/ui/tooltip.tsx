// TooltipLabel.tsx
import { IoAlertCircleOutline } from "react-icons/io5";
import { tooltipDescriptions } from "../../../public/data/tooltip-info";

interface TooltipLabelProps {
  label: string;
  fieldKey: string;
  htmlFor?: string;
  className?: string;
}

const TooltipLabel: React.FC<TooltipLabelProps> = ({
  label,
  fieldKey,
  htmlFor,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`flex items-center gap-1 text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {label}
      {tooltipDescriptions[fieldKey] && (
        <div className="relative group">
          <span className="text-gray-400 cursor-pointer">
            <IoAlertCircleOutline className="w-4 h-4" />
          </span>
          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
            {tooltipDescriptions[fieldKey]}
          </div>
        </div>
      )}
    </label>
  );
};

export default TooltipLabel;

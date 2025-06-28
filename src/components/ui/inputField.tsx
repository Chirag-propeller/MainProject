// components/InputField.tsx
import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="w-full mb-4">
      <label 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" 
        htmlFor={name}
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
      />
    </div>
  );
};

export default InputField;
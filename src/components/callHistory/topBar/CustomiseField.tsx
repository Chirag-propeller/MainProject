// import React from 'react'

// const CustomiseField = ({customiseField, setCustomiseField, allFields}: {customiseField: string[], setCustomiseField: (field: string[]) => void, allFields: string[]}) => {
//   const clickHandler = (field: string) => {
//     if(customiseField.includes(field)){
//       setCustomiseField(customiseField.filter((item) => item !== field));
//     }else{
//       setCustomiseField([...customiseField, field]);
//     }
//   }
//   return (
//     <div>
//       {allFields.map(field => (
//         <label key={field} style={{ display: 'block' }}>
//           <input
//             type="checkbox"
//             value={field}
//             checked={customiseField.includes(field)}
//             onChange={() => clickHandler(field)}
//           />
//           {field}
//         </label>
//       ))}
//     </div>
//   )
// }

// export default CustomiseField


import React, { useState, useRef, useEffect } from 'react';
import { CALL_ANALYSIS_FIELD_LABELS } from "@/lib/callAnalysisFieldMap";

interface CustomiseFieldProps {
  customiseField: string[];
  setCustomiseField: (field: string[]) => void;
  allFields: string[];
}

const CustomiseField: React.FC<CustomiseFieldProps> = ({
  customiseField,
  setCustomiseField,
  allFields,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const clickHandler = (field: string) => {
    if (customiseField.includes(field)) {
      setCustomiseField(customiseField.filter((item) => item !== field));
    } else {
      setCustomiseField([...customiseField, field]);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className='relative inline-block' >
      <button onClick={toggleDropdown} className='px-4 py-2'>
        Customise Fields ▾
      </button>
      {isOpen && (
        <div
          className='absolute top-full left-0 z-100 bg-white border border-gray-300 w-fit rounded-md p-2 max-h-40 overflow-y-auto'
        >
          {allFields.map((field) => (
            <label key={field} className='flex items-center w-fit text-nowrap text-sm' 
              // style={{ display: 'block', marginBottom: '5px' }}
              >
              <input
                type="checkbox"
                value={field}
                checked={customiseField.includes(field)}
                onChange={() => clickHandler(field)}
                className='mr-1'
              />{' '}
              {CALL_ANALYSIS_FIELD_LABELS[field] ||
                field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomiseField;

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
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [checkedFields, setCheckedFields] = useState<string[]>(customiseField);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  
  useEffect(() => {
    setCheckedFields(customiseField);
  }, [customiseField]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const clickHandler = (field: string) => {
    if (checkedFields.includes(field)) {
      setCheckedFields(checkedFields.filter((item) => item !== field));
    } else {
      setCheckedFields([...checkedFields, field]);
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

  const applyHandler = async () => {
    setCustomiseField(checkedFields);
    const response = await fetch('/api/user/post', {
      method: 'POST',
      body: JSON.stringify({ callHistoryFields: checkedFields }),
    });
    const data = await response.json();
    console.log(data);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className='relative inline-block' >
      <button onClick={toggleDropdown} 
              className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors  ${
                isOpen 
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
      >
        Custom Fields <ChevronDown className='w-3.5 h-3.5  self-center text-indigo-600' />
      </button>
      {isOpen && (
        <div
          className='absolute top-full left-0 z-100 bg-white border border-gray-300 w-fit rounded-md p-2 pb-0 max-h-60 overflow-y-auto'
        >
          {allFields.map((field) => (
            <label key={field} className='flex items-center w-fit text-nowrap text-sm' 
              // style={{ display: 'block', marginBottom: '5px' }}
              >
              <input
                type="checkbox"
                value={field}
                checked={checkedFields.includes(field)}
                onChange={() => clickHandler(field)}
                className='mr-1'
              />{' '}
              {CALL_ANALYSIS_FIELD_LABELS[field] ||
                field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
          ))}
          <div className=' flex justify-between sticky bottom-0 bg-white py-1'>
            <Button
              variant="secondary"
              size="sm"
              onClick={applyHandler}
              className='rounded-[2px] px-2 py-1 text-xs'
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomiseField;

import React from 'react'

interface SelectionDropdownProps {
    options: {name: string, value: string}[]; // List of options
    selectedOption: string; // Current selected option
    setOption: React.Dispatch<React.SetStateAction<string>>; // Function to update the selected option
    loading?: boolean
  }

const SelectionDropdown: React.FC<SelectionDropdownProps> = ({options, selectedOption, setOption, loading}) => {
  return (
    <div>
        <select 
            className='p-1.5 rounded-lg w-full text-sm bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
            value={selectedOption}
            onChange={(e) => setOption(e.target.value)}
          >
            {options.length > 0 ? options?.map((option: any, idx:any) => (
              <option key={idx} value={option.value} className='p-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100'> {option.name} </option>
            )) : <option value="" className='bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100'>No options available</option>}
        </select>
    </div>
  )
}

export default SelectionDropdown
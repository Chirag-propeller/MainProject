import React from 'react'

interface SelectOptionsProps {
    options: string[]; // List of options
    selectedOption: string; // Current selected option
    setOption: React.Dispatch<React.SetStateAction<string>>; // Function to update the selected option
    loading?: boolean
  }

const SelectOptions: React.FC<SelectOptionsProps> = ({options, selectedOption, setOption, loading}) => {
  return (
    <div>
        <select 
            className='p-1.5 rounded-lg w-full text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
            value={selectedOption}
            onChange={(e) => setOption(e.target.value)}
          >
            {options.length > 0 ? options?.map((option: any, idx:any) => (
              <option key={idx} value={option} className='p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'> {option} </option>
            )) : <option value="" className='bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>No options available</option>}
        </select>
    </div>
  )
}

export default SelectOptions
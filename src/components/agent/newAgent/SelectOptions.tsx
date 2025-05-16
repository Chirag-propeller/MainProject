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
            className='p-1.5  rounded-lg w-full text-sm bg-gray-100 border border-gray-300 '
            value={selectedOption}
            onChange={(e) => setOption(e.target.value)}
          >
            {options.length > 0 ? options?.map((option: any, idx:any) => (
              <option key={idx} value={option} className='p-1'> {option} </option>
            )) : <option value="">No options available</option>}
        </select>
    </div>
  )
}

export default SelectOptions
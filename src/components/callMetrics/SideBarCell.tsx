import React from 'react'

const SideBarCell = ({title, value}: {title: string, value: string|boolean|number}) => {
  const isSummary = title === "Summary";
  return (
    <div className='flex flex-row gap-1'>
        <h2 className='text-xs text-black '>{title}: </h2>
        <p className={`text-xs ${isSummary ? "italic" : ""}`}>{value === false ? "false" : value}</p>
    </div>
  )
}

export default SideBarCell
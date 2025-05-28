import React from 'react'

const SideBarCell = ({title, value}: {title: string, value: string|boolean|number}) => {
  return (
    <div className='flex flex-row gap-1'>
        <h2 className='text-xs text-black '>{title}: </h2>
        <p className='text-xs text-gray-500'>{value === false ? "false" : value}</p>
    </div>
  )
}

export default SideBarCell
import React from 'react'
import CustomiseField from './CustomiseField'

const FunctionalityBar = ({customiseField, setCustomiseField, allFields}: {customiseField: string[], setCustomiseField: (field: string[]) => void, allFields: string[]}) => {
  return (
    <div className='flex justify-start'>
        <CustomiseField customiseField={customiseField} setCustomiseField={setCustomiseField} allFields={allFields}/>
        
    </div>
  )
}

export default FunctionalityBar
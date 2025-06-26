import React from 'react'
import CustomiseField from './CustomiseField'
import Filter, { FilterState } from './Filter'
import DateFilter, { DateRangeFilter } from './DateFilter'
import { Agent } from '@/components/agents/types';
import Export from './Export'

type FilterOption = {
  label: string;
  value: string;
};

const FunctionalityBar = ({
  customiseField, 
  setCustomiseField, 
  allFields, 
  filters, 
  setFilters,
  dateRange,
  setDateRange,
  agentOptions,
  statusOptions,
  sentimentOptions
}: {
  customiseField: string[], 
  setCustomiseField: (field: string[]) => void, 
  allFields: string[],
  filters: FilterState,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
  dateRange: DateRangeFilter,
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeFilter>>,
  agentOptions: Agent[],
  statusOptions: FilterOption[],
  sentimentOptions: FilterOption[]
}) => {
  return (
    <div className='flex pb-2 justify-between gap-2 w-full'>
      <div className='flex gap-2'>
      <DateFilter
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
        <Filter 
          filters={filters}
          setFilters={setFilters}
          agentOptions={agentOptions}
          statusOptions={statusOptions}
          sentimentOptions={sentimentOptions}
        />
        <CustomiseField customiseField={customiseField} setCustomiseField={setCustomiseField} allFields={allFields}/>
        </div>

      <div className=' flex mr-20 self-center'>
      <Export filters={filters} dateRange={dateRange}/>
      </div>
        
    </div>
  )
}

export default FunctionalityBar
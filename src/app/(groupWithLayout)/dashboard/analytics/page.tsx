
"use client"

import DiagramCanvas from '@/components/analytics/diagram/DiagramCanvas'
import Filters from '@/components/analytics/FilterBar'
import React, { useEffect, useState } from 'react'
import CallChart from '@/components/analytics/charts/TotalCallVsTime'

const page = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    console.log(filters);
  }, [filters]);
  return (
    <div className='w-full h-[200vh] overflow-y-auto '>
      <div className='text-xl py-2 my-2'>Analytics</div>
      <div className='flex flex-col gap-2'>
        {/* <NumberCard  heading="Total Users" subheading="Since last week" value="12,430" /> */}
        <Filters  onChange={setFilters} />

        {/* <SankeyDiagram />  */}
        {/* <MergedTable /> */}
        <DiagramCanvas filters={filters} />
        <CallChart filters={filters} />

      </div>

    </div>
  )
}

export default page
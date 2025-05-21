"use client"
import DiagramCanvas from '@/components/analytics/diagram/DiagramCanvas'
import Filters from '@/components/analytics/FilterBar'
import React, { useEffect, useState } from 'react'
import CallChart from '@/components/analytics/charts/TotalCallVsTime'
import { LineChart } from 'lucide-react'

const page = () => {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    console.log(filters);
  }, [filters]);
  return (
    <div className='w-full h-[200vh] overflow-y-auto px-4'>
      <div className='flex gap-1.5 py-4'>
        <LineChart className='w-3.5 h-3.5  self-center text-indigo-600' />
        <h1 className="text-lg  self-center text-indigo-600">Analytics</h1>
      </div>
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
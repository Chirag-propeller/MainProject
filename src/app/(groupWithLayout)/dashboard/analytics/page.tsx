"use client"
import DiagramCanvas from '@/components/analytics/diagram/DiagramCanvas'
import Filters from '@/components/analytics/FilterBar'
import React, { useEffect, useState, useCallback } from 'react'
import CallChart from '@/components/analytics/charts/TotalCallVsTime'
import { LineChart } from 'lucide-react'
import { FilterState } from '@/components/callHistory/topBar/Filter'

// Define the analytics filter interface
interface AnalyticsFilters extends FilterState {
  startDate: string | null;
  endDate: string | null;
}

const page = () => {
  // Initialize with empty filters
  const now = new Date();
  const initialStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const initialEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [filters, setFilters] = useState<AnalyticsFilters>({
    agent: [],
    status: [],
    sentiment: [],
    startDate: "",
    endDate: "",
  });
  useEffect(()=> {
    setFilters({
      agent: [],
      status: [],
      sentiment: [],
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
    })
  },[])
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  // Log filter changes for debugging
  useEffect(() => {
    console.log('Analytics filters updated:', filters);
    
    // Here you would typically make API calls with the filters
    // For example:
    // fetchAnalyticsData(filters).then(data => setData(data));
  }, [filters]);

  // Handle filter changes from the filter bar - memoized to prevent unnecessary rerenders
  const handleFilterChange = useCallback((newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className='w-full h-[200vh] overflow-y-auto px-4'>
      <div className='flex gap-1.5 py-4'>
        <LineChart className='w-3.5 h-3.5 self-center text-indigo-600' />
        <h1 className="text-lg self-center text-indigo-600">Analytics</h1>
      </div>
      <div className='flex flex-col gap-2'>
        {/* <NumberCard  heading="Total Users" subheading="Since last week" value="12,430" /> */}
        <Filters onChange={handleFilterChange} />

        {/* <SankeyDiagram />  */}
        {/* <MergedTable /> */}
        <DiagramCanvas filters={filters} />
        <CallChart filters={filters} />

      </div>

    </div>
  )
}

export default page
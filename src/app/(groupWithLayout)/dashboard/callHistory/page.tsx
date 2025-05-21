"use client"

import Table from '@/components/callMetrics/Table'
import React, { useState, useEffect } from 'react'
import FunctionalityBar from '@/components/callHistory/topBar/FunctionalityBar'
import { FilterState } from '@/components/callHistory/topBar/Filter'
import { DateRangeFilter } from '@/components/callHistory/topBar/DateFilter'
import axios from 'axios'
import { Agent } from '@/components/agents/types'
import { History } from 'lucide-react'

const allFields = ["started_at", "direction", "duration", "status", "agent", "average_latency", "phonenumber", "from_phonenumber", "cost", "sentiment", "goal_completion_status"]

// Sample data for filters

const statusOptions = [
  { label: 'Connected', value: 'connected' },
  { label: 'Not Connected', value: 'not_connected' },
]

const sentimentOptions = [
  { label: 'Positive', value: 'positive' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Negative', value: 'negative' },
]

const page = () => {
  const [agentOptions, setAgentOptions] = useState<Agent[]>([]);
  const [customiseField, setCustomiseField] = useState(["started_at", "direction", "duration", "status", "agent", "average_latency", "phonenumber"]);
  const [filters, setFilters] = useState<FilterState>({
    agent: [],
    status: [],
    sentiment: [],
  });
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await axios.get("/api/agents/get")
      const agents = response.data
      console.log(agents);
      setAgentOptions(agents);
    }
    fetchAgents()
  }, [])

  // You could implement the filtering logic here or pass the filters to the Table component

  return (
    <div className='pl-4'>

      <div className='flex gap-1.5 py-4'>
        <History className='w-3.5 h-3.5  self-center text-indigo-600' />
        <h1 className="text-lg  self-center text-indigo-600">Call History</h1>
      </div>
      {/* <div className='flex justify-start'>

        <div className='text-xl py-2 my-2'>Call History</div>
      </div> */}
    
      <div className='flex justify-start'>
        <FunctionalityBar 
          customiseField={customiseField} 
          setCustomiseField={setCustomiseField} 
          allFields={allFields} 
          filters={filters}
          setFilters={setFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
          agentOptions={agentOptions}
          statusOptions={statusOptions}
          sentimentOptions={sentimentOptions}
        />
      </div>
      <Table customiseField={customiseField} filters={filters} agentOptions={agentOptions} dateRange={dateRange} />
    </div>
  )
}

export default page
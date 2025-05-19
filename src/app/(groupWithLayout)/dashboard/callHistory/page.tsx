"use client"

import Table from '@/components/callMetrics/Table'
import React, { useState } from 'react'
import FunctionalityBar from '@/components/callHistory/topBar/FunctionalityBar'

const allFields = ["started_at", "direction", "duration","status", "agent", "average_latency","phonenumber", "from_phonenumber", "cost", "sentiment", "goal_completion_status"]

const page = () => {
  const [customiseField, setCustomiseField] = useState(["started_at", "direction", "duration","status", "agent", "average_latency","phonenumber"]);
  return (
    <div>
      <div className='text-xl py-2 my-2'>Call History</div>
      <div className='flex justify-start'>
        <FunctionalityBar customiseField={customiseField} setCustomiseField={setCustomiseField} allFields={allFields}/>

      </div>
      <Table customiseField={customiseField}/>

    </div>
  )
}

export default page
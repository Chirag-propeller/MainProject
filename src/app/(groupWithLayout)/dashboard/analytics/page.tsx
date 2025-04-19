import NumberCard from '@/components/analytics/NumberCard'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='text-xl py-2 my-2'>Analytics</div>
      <div className='flex flex-wrap gap-2'>
        <NumberCard  heading="Total Users" subheading="Since last week" value="12,430" />

      </div>

    </div>
  )
}

export default page
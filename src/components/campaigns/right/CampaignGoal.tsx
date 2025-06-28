import React from 'react'
import { Agent } from '../types'
import { Campaign } from '../types'

const CampaignGoal = ({campaign, agents}: {campaign: Campaign, agents: Agent[]}) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-950 dark:border dark:border-gray-600 dark:rounded-lg">
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Campaign Goal section is under development.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          This will contain campaign-specific goals and objectives.
        </p>
      </div>
    </div>
  )
}

export default CampaignGoal
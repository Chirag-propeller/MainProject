"use client"
import React from 'react'
import AgentHeader from './Header'

const MiddleBar = () => {

    const handleCreateAgent = async () => {
        console.log('create agent')
    }

  return (
    <div>

<div className="w-1/4 border-r border-gray-200 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
        <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-100">
          <AgentHeader 
            title="Agents"
            onCreate={handleCreateAgent}
          />
        </div>

        <div className="flex-1" style={{ height: 'calc(100% - 70px)', overflow: 'hidden' }}>
          {/* <CampaignTabs 
            campaigns={campaigns}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            deleteLoading={deleteLoading}
            onDeleteCampaign={handleDeleteCampaign}
            setNewCampaign={setNewCampaign}
          /> */}
        </div>
      </div>
        
    </div>
  )
}

export default MiddleBar
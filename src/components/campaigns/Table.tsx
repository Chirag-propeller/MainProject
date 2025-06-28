'use client'
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Campaign {
  _id:string;
  campaignCallId: string;
  campaignCallName?: string;
  fromNumber?: string;
  callDate?: string;
  callTimezone?: string;
  agentId?: string;
  createdAt: string;
}

interface Agent {
  _id: string;
  agentId: string;
  agentName: string;
}


const CampaignTable = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [agent, setAgent] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch('/api/createCampaign/get');
        const data = await res.json();
        console.log(data)
        setCampaigns(data);
      } catch (err) {
        console.error('Failed to fetch Campaign:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchAgent = async () => {
      try {
        const res = await fetch('/api/agent/get');
        const data = await res.json();
        console.log(data)
        setAgent(data);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
    fetchAgent();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
  
    try {
      const res = await fetch('/api/createCampaign/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (res.ok) {
        setCampaigns(prev => prev.filter(campaign => campaign._id !== id));
      } else {
        const error = await res.json();
        alert('Failed to delete agent: ' + error.error);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('An error occurred while deleting.');
    }
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Campaigns</h2>

      {loading ? (
        <p className="text-gray-600">Loading campaign...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                {/* agentName, start date and time, from number */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              </tr>
            </thead>
                            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100 dark:divide-gray-700">
              {campaigns.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{campaign.campaignCallName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{  agent.find(a => a.agentId === campaign.agentId)?.agentName || 'No Agent Attached'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{campaign.fromNumber || '-'}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-gray-700">
                    
                    <button onClick={(e) =>{
                      e.stopPropagation(); // prevent row click navigation
                      handleDelete(campaign._id);
                    }} 
                    
                    className="text-gray-700 cursor-pointer hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No Campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;

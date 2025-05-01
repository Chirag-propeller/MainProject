'use client'
import React, { useEffect, useState } from 'react';

interface Campaign {
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
            <tbody className="bg-white divide-y divide-gray-100">
              {campaigns.map((compaign, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{compaign.campaignCallName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{  agent.find(a => a.agentId === compaign.agentId)?.agentName || 'No Agent Attached'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{compaign.createdAt ? new Date(compaign.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{compaign.fromNumber || '-'}</td>
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

'use client'
import React, { useEffect, useState } from 'react';

interface Agent {
  agentId: string;
  llm?: string;
  prompt?: string;
  _id: string;
  inputLanguage: string;
}

const AgentTable = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agent/get');
        const data = await res.json();
        console.log(data)
        setAgents(data);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Agents</h2>

      {loading ? (
        <p className="text-gray-600">Loading agents...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LLM Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {agents.map((agent, index) => (
                <tr key={agent._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{agent.agentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{agent.llm || '-'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{agent.prompt || '-'}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-gray-700">{agent.inputLanguage || '-'}</td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No agents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentTable;

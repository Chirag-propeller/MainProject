import React from 'react'

const AgentDetail = ({selectedAgent}: any) => {
  return (
        <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg space-y-4 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Agent Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base">{selectedAgent.agentName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Agent ID</p>
                <p className="text-base">{selectedAgent.agentId}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">LLM</p>
                <p className="text-base">{selectedAgent.llm}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Language</p>
                <p className="text-base">{selectedAgent.inputLanguage}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Voice</p>
                <p className="text-base">{selectedAgent.ttsVoiceName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Knowledge Base Attached</p>
                <p className="text-base">{selectedAgent.knowledgeBaseAttached? "Yes" : "No"}</p>
            </div>
            </div>
        </div>
  )
}

export default AgentDetail
import React from 'react'

const AgentDetail = ({selectedAgent}: any) => {
  return (
        <div className="mt-6 p-6 bg-white dark:bg-gray-950 rounded-2xl shadow-lg dark:shadow-gray-700/50 space-y-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Agent Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.agentName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent ID</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.agentId}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">LLM</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.llm}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.inputLanguage}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Voice</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.ttsVoiceName}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Knowledge Base Attached</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{selectedAgent.knowledgeBaseAttached? "Yes" : "No"}</p>
            </div>
            </div>
        </div>
  )
}

export default AgentDetail
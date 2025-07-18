'use client'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SideBar from './Canvas/SideBar'
import MainCanvas from './Canvas/MainCanvas'
import ConversationNodeSidebar from './Canvas/CustomComponentSidebar/ConversationNodeSidebar'
import ApiRequestNodeSidebar from './Canvas/CustomComponentSidebar/ApiRequestNodeSidebar'
import EndCallNodeSidebar from './Canvas/CustomComponentSidebar/EndCallNodeSidebar'
import EdgeSidebar from './Canvas/CustomComponentSidebar/EdgeSidebar'
import WorkflowTopBar from './WorkflowTopBar'
import { useWorkflowStore } from '@/store/workflowStore'

interface MainComponentProps {
  workflowId?: string;
}

const MainComponent = ({ workflowId }: MainComponentProps) => {
  const searchParams = useSearchParams()
  const { 
    nodes, 
    edges, 
    selectedNode, 
    selectedEdge,
    isLoading,
    lastSaved,
    globalPrompt,
    globalNodes,
    currentWorkflowId,
    loadWorkflow,
    saveWorkflow,
    clearNodes,
    autoSave,
    setCurrentWorkflowId,
    initializeUser,
    updateWorkflowName
  } = useWorkflowStore()

  // Initialize user and load workflow on component mount
  useEffect(() => {
    const initialize = async () => {
      // First initialize the user
      await initializeUser()
      
      // Then load the workflow if we have an ID
      const targetWorkflowId = workflowId || searchParams?.get('workflowId')
      if (targetWorkflowId) {
        setCurrentWorkflowId(targetWorkflowId)
        loadWorkflow(targetWorkflowId)
      }
    }
    
    initialize()
  }, [loadWorkflow, workflowId, searchParams, setCurrentWorkflowId, initializeUser])

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      autoSave()
    }
  }, [nodes, edges, autoSave])

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveWorkflow().then(() => {
          console.log('Auto-saved workflow at:', new Date().toLocaleTimeString())
        }).catch(error => {
          console.error('Auto-save failed:', error)
        })
      }
    }, 5 * 60 * 1000) // 5 minutes in milliseconds

    return () => clearInterval(autoSaveInterval)
  }, [saveWorkflow, nodes.length, edges.length])

  const handleManualSave = async () => {
    try {
      await saveWorkflow()
      alert('Workflow saved successfully!')
    } catch (error) {
      alert('Failed to save workflow')
      console.error('Save error:', error)
    }
  }

  const handleManualLoad = async () => {
    if (!currentWorkflowId) {
      alert('No workflow ID available to load')
      return
    }
    
    try {
      const result = await loadWorkflow(currentWorkflowId)
      if (result.success) {
        alert('Workflow loaded successfully!')
      } else {
        alert('No saved workflow found')
      }
    } catch (error) {
      alert('Failed to load workflow')
      console.error('Load error:', error)
    }
  }

  const printSystemData = () => {
    const systemData = {
      nodes,
      edges,
      globalPrompt,
      globalNodes,
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        globalNodeCount: globalNodes.length,
        exportedAt: new Date().toISOString(),
        lastSaved: lastSaved?.toISOString()
      }
    }

    console.log('=== COMPLETE SYSTEM DATA ===')
    console.log(JSON.stringify(systemData, null, 2))
    console.log('=== SUMMARY ===')
    console.log(`Nodes: ${nodes.length}`)
    console.log(`Edges: ${edges.length}`)
    console.log(`Global Nodes: ${globalNodes.length}`)
    
    // Also copy to clipboard if possible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(systemData, null, 2)).then(() => {
        console.log('System data copied to clipboard!')
        alert('Complete system data (nodes + edges) copied to clipboard!')
      }).catch(() => {
        alert('System data printed to console (clipboard failed)')
      })
    } else {
      alert('System data printed to console')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-screen flex flex-col overflow-hidden'>
      <WorkflowTopBar clearNode={clearNodes} handleSave={handleManualSave} isLoading={isLoading} />
      <div className='relative w-full flex-1 flex overflow-hidden'>
        <SideBar />
        <MainCanvas />
      
      {/* Right panel container */}
      <div className="absolute top-4 right-4 flex flex-col gap-4 z-20 max-h-[calc(100vh-8rem)] overflow-hidden">
        {/* Sidebars section */}
        {(selectedNode || selectedEdge) && (
          <div className="flex flex-col gap-2 max-h-full overflow-hidden">
            {selectedNode && selectedNode.data.type === 'Conversation' && <ConversationNodeSidebar />}
            {selectedNode && selectedNode.data.type === 'API' && <ApiRequestNodeSidebar />}
            {selectedNode && selectedNode.data.type === 'endcall' && <EndCallNodeSidebar />}
            {selectedEdge && <EdgeSidebar />}
          </div>
        ) 
        // : (
        //     /* Control buttons section - only shown when no sidebar is visible */
        //     <div className="flex flex-col gap-2">
        //       <button 
        //         onClick={handleManualSave}
        //         disabled={isLoading}
        //         className='bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded'
        //       >
        //         {isLoading ? 'Saving...' : 'Save Workflow'}
        //       </button>
              
        //       <button 
        //         onClick={handleManualLoad}
        //         disabled={isLoading}
        //         className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded'
        //       >
        //         {isLoading ? 'Loading...' : 'Load Workflow'}
        //       </button>
              
        //       <button 
        //         onClick={printSystemData}
        //         className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded'
        //       >
        //         Print System Data
        //       </button>
              
        //       <button 
        //         onClick={clearNodes}
        //         className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
        //       >
        //         Clear All
        //       </button>
        //     </div>
        //   )
          }
        </div>
        
        {/* Status info */}
        <div className='absolute bottom-4 left-4 bg-white p-3 rounded z-20 text-sm border shadow'>
          <div>Nodes: {nodes.length} | Edges: {edges.length} | Global: {globalNodes.length}</div>
          {lastSaved && (
            <div className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainComponent
'use client'
import React, { useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import SideBar from './Canvas/SideBar'
import MainCanvas from './Canvas/MainCanvas'
import ConversationNodeSidebar from './Canvas/CustomComponentSidebar/ConversationNodeSidebar'
import ApiRequestNodeSidebar from './Canvas/CustomComponentSidebar/ApiRequestNodeSidebar'
import EndCallNodeSidebar from './Canvas/CustomComponentSidebar/EndCallNodeSidebar'
import RagSidebar from './Canvas/CustomComponentSidebar/RagSidebar'
import TransferNodeSidebar from './Canvas/CustomComponentSidebar/TransferNodeSidebar'
import EdgeSidebar from './Canvas/CustomComponentSidebar/EdgeSidebar'
import WorkflowTopBar from './WorkflowTopBar'
import { useWorkflowStore } from '@/store/workflowStore'

interface MainComponentProps {
  workflowId?: string;
}

const MainComponent = ({ workflowId }: MainComponentProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname();
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
    // autoSave,
    setCurrentWorkflowId,
    initializeUser,
    updateWorkflowName,
    hasUnsavedChanges,
    setInitialState
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
        const result = await loadWorkflow(targetWorkflowId)
        if (result.success) {
          // Ensure initial state is set after successful load
          setTimeout(() => {
            setInitialState()
          }, 100)
        }
      } else {
        // If no workflow ID, set initial state for new workflow
        setTimeout(() => {
          setInitialState()
        }, 100)
      }
    }
    
    initialize()
  }, [loadWorkflow, workflowId, searchParams, setCurrentWorkflowId, initializeUser, setInitialState])

  // Handle page refresh/navigation warnings when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Modern approach - just preventDefault is sufficient
        e.preventDefault()
        // The return value is ignored in modern browsers, but we keep it for older browsers
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])
  // useEffect(() => {
  //   // 1. Handler for HARD navigation (reload, close tab, external link)
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (hasUnsavedChanges) {
  //       e.preventDefault();
  //       e.returnValue = '';
  //     }
  //   };
  
  //   // 2. Handler for SOFT navigation (browser back/forward buttons)
  //   const handlePopState = () => {
  //     if (hasUnsavedChanges) {
  //       const confirmed = window.confirm(
  //         'You have unsaved changes. Are you sure you want to leave?'
  //       );
  //       if (!confirmed) {
  //         // If the user clicks "Cancel", we push the current path back to the history.
  //         // This effectively cancels the "back" navigation.
  //         window.history.pushState(null, '', pathname);
  //       }
  //     }
  //   };
  
  //   // Add both listeners
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   window.addEventListener('popstate', handlePopState);
  
  //   // Cleanup function to remove both listeners
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [hasUnsavedChanges, pathname]); // Depend on both state and current path
  
  // Auto-save when nodes or edges change
  // useEffect(() => {
  //   if (nodes.length > 0 || edges.length > 0) {
  //     autoSave()
  //   }
  // }, [nodes, edges, autoSave])

  // Auto-save every 5 minutes
  // useEffect(() => {
  //   const autoSaveInterval = setInterval(() => {
  //     if (nodes.length > 0 || edges.length > 0) {
  //       saveWorkflow().then(() => {
  //         console.log('Auto-saved workflow at:', new Date().toLocaleTimeString())
  //       }).catch(error => {
  //         console.error('Auto-save failed:', error)
  //       })
  //     }
  //   }, 5 * 60 * 1000) // 5 minutes in milliseconds

  //   return () => clearInterval(autoSaveInterval)
  // }, [saveWorkflow, nodes.length, edges.length])

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
        <div className="absolute top-4 right-4 flex flex-col gap-4 z-20 max-h-[calc(100vh-4rem)] overflow-hidden border border-gray-200 rounded-lg shadow-lg">
          {/* Sidebars section */}
          {(selectedNode || selectedEdge) && (
            <div className="flex flex-col gap-2 max-h-full overflow-hidden">
              {selectedNode && selectedNode.data.type === 'Conversation' && <ConversationNodeSidebar />}
              {selectedNode && selectedNode.data.type === 'API' && <ApiRequestNodeSidebar />}
              {selectedNode && selectedNode.data.type === 'endcall' && <EndCallNodeSidebar />}
              {selectedNode && selectedNode.data.type === 'RAG' && <RagSidebar />}
              {selectedNode && selectedNode.data.type === 'transfer' && <TransferNodeSidebar />}
              {selectedEdge && <EdgeSidebar />}
            </div>
          )}
        </div>
        
        {/* Status info */}
        <div className='absolute bottom-4 left-4 bg-white p-3 rounded z-20 text-sm border shadow'>
          <div className="flex items-center gap-2">
            <span>Nodes: {nodes.length} | Edges: {edges.length} | Global: {globalNodes.length}</span>
            {hasUnsavedChanges && (
              <span className="text-amber-600 font-medium">• Unsaved</span>
            )}
          </div>
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
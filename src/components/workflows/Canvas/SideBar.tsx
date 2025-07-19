"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import GlobalPromptBox from './others/GlobalPromptBox'
import GlobalConfigModal from './others/GlobalConfigModal'
import AddNodeModal from './others/AddNodeModal'
import { useWorkflowStore } from '@/store/workflowStore'

const SideBar: React.FC = () => {
  const { isGlobalPromptOpen, setIsGlobalPromptOpen } = useWorkflowStore()
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false)
  const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false)

  return (
    <div className='absolute top-3 left-5 bg-transparent z-10'>
        <div className='flex flex-col gap-2 items-start '>

        <Button className='rounded-[4px]' size='sm' onClick={() => setIsAddNodeModalOpen(true)}>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Node
        </Button>
        
        <Button variant='secondary' className='rounded-[4px] border-1 border-indigo-500' size='sm' onClick={() => setIsGlobalPromptOpen(!isGlobalPromptOpen)}>
            Global Prompt
        </Button>
        {!!isGlobalPromptOpen && <GlobalPromptBox />}
        
        <Button variant='secondary' className='rounded-[4px] border-1 border-indigo-500' size='sm' onClick={() => setIsGlobalConfigOpen(true)}>
            Global Configuration
        </Button>
        
        <AddNodeModal 
          isOpen={isAddNodeModalOpen} 
          onClose={() => setIsAddNodeModalOpen(false)} 
        />

        <GlobalConfigModal 
          isOpen={isGlobalConfigOpen} 
          onClose={() => setIsGlobalConfigOpen(false)} 
        />

        </div>
        
    </div>
  )
}

export default SideBar
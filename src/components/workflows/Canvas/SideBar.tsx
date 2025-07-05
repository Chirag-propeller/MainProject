"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import GlobalPromptBox from './others/GlobalPromptBox'
import AddNodeModal from './others/AddNodeModal'
import { useWorkflowStore } from '@/store/workflowStore'

const SideBar: React.FC = () => {
  const { isGlobalPromptOpen, setIsGlobalPromptOpen } = useWorkflowStore()
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false)

  return (
    <div className='absolute top-10 left-10 bg-transparent z-10'>
        <div className='flex flex-col gap-4 items-start '>

        <Button className='rounded-[4px]' size='sm' onClick={() => setIsAddNodeModalOpen(true)}>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Node
        </Button>
        
        <Button variant='secondary' className='rounded-[4px]' size='sm' onClick={() => setIsGlobalPromptOpen(!isGlobalPromptOpen)}>
            Global Prompt
        </Button>
        {isGlobalPromptOpen && <GlobalPromptBox />}
        
        <AddNodeModal 
          isOpen={isAddNodeModalOpen} 
          onClose={() => setIsAddNodeModalOpen(false)} 
        />

        </div>
        
    </div>
  )
}

export default SideBar
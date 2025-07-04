"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, MessageSquare } from 'lucide-react'
import React from 'react'
import GlobalPromptBox from './others/GlobalPromptBox'
import { useWorkflowStore } from '@/store/workflowStore'

const SideBar: React.FC = () => {
  const { addNode, isGlobalPromptOpen, setIsGlobalPromptOpen } = useWorkflowStore()

  const clickHandler = () => {
    console.log('clicked')
    addNode('Conversation Node')
  }
  return (
    <div className='absolute top-10 left-10 bg-transparent z-10'>
        <div className='flex flex-col gap-4 items-start '>

        <Button className='rounded-[4px]' size='sm' onClick={clickHandler}>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Node
        </Button>
        <Button variant='secondary' className='rounded-[4px]' size='sm' onClick={() => setIsGlobalPromptOpen(!isGlobalPromptOpen)}>
            Global Prompt
        </Button>
        {isGlobalPromptOpen && <GlobalPromptBox />}

        </div>
        
    </div>
  )
}

export default SideBar
"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, MessageSquare } from 'lucide-react'
import React from 'react'

interface SideBarProps {
  onAddNode: (nodeType: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onAddNode }) => {

    const clickHandler = () => {
        console.log('clicked')
        onAddNode('Conversation Node');
    }
  return (
    <div className='absolute top-10 left-10 bg-transparent z-10'>
        <div className='flex flex-col gap-4 items-start '>

        <Button className='rounded-[4px]' size='sm' onClick={clickHandler}>
            <MessageSquare className='w-4 h-4 mr-2' />
            Add Conversation Node
        </Button>
        <Button variant='secondary' className='rounded-[4px]' size='sm'>
            Global Prompt
        </Button>
        </div>
        
    </div>
  )
}

export default SideBar
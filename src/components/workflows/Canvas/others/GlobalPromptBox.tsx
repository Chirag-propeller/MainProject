'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWorkflowStore } from '@/store/workflowStore'

const GlobalPromptBox: React.FC = () => {
  const { globalPrompt, setGlobalPrompt, setIsGlobalPromptOpen } = useWorkflowStore()

  const boxRef = useRef<HTMLDivElement>(null)
  const maxChars = 3000
  const [text, setText] = useState(globalPrompt)

  useEffect(() => {
    setText(globalPrompt)
  }, [globalPrompt])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsGlobalPromptOpen(false)
      }
    }

    // Use a small delay to ensure the event listener is properly attached
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [setIsGlobalPromptOpen])

  return (


    <Card className="w-full relative z-50" ref={boxRef} >
      <CardHeader className="pb-3">
        <h3 className="text-lg font-medium text-gray-900">Global Prompt</h3>
        <p className="text-sm text-gray-500">
          Define the global prompt that will be used across the workflow
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              const text = e.target.value
              if (text.length <= maxChars) {
                setText(text)
              }
            }}
            placeholder="Enter your global prompt here..."
            className="w-full min-h-[150px] px-3 py-2 text-sm border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-400 bg-white px-1 ">
            {text.length} / {maxChars}
          </span>
        </div>
      </CardContent>
      <div className='flex justify-end gap-2 m-2'>
        <Button variant='secondary' size='sm' onClick={() => {
          setText(globalPrompt) // Reset to original value
          setIsGlobalPromptOpen(false)
        }}>
          Cancel
        </Button>
        <Button onClick={() => {
          setGlobalPrompt(text)
          setIsGlobalPromptOpen(false)
        }} size='sm'>
          Save
        </Button>
      </div>
    </Card>
  )
}

export default GlobalPromptBox
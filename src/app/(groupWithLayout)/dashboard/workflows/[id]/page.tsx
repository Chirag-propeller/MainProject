import React from 'react'
import MainComponent from '@/components/workflows/MainComponent'

interface WorkflowPageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: WorkflowPageProps) => {
  const { id } = await params;
  
  return (
    <div className='w-full h-full'>
        <MainComponent workflowId={id} />
    </div>
  )
}

export default page
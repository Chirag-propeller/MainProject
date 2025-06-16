import React, { useState, useRef } from 'react'
import { Agent } from '@/components/agents/types'
import { Wrench, Triangle, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ToolsContent = ({ agentId, agent, setAgent }: { agentId: string, agent: Agent, setAgent: (agent: Agent) => void }) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const uploadFile = async (file: File) => {
        const formData = new FormData()
        setIsUploading(true)
        formData.append('agent_id', agentId)
        formData.append('file', file)
        const url = process.env.NEXT_PUBLIC_AZURE_URL
        
        try {
            console.log('Frontend: Starting direct upload to Azure service')
            console.log('Frontend: Upload URL:', `${url}/upload-pdf`)
            console.log('Frontend: Current domain:', window.location.origin)
            console.log('Frontend: Environment:', process.env.NODE_ENV)
            console.log('Frontend: File details:', {
                name: file.name,
                size: file.size,
                type: file.type
            })
            
            const response = await axios.post(`${url}/upload-pdf`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'x-api-key': 'supersecretapikey123'
                },
                timeout: 60000, // Increased to 60 seconds
                maxContentLength: 50 * 1024 * 1024, // 50MB max
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    console.log('Upload progress:', percentCompleted + '%')
                }
            })
            
            console.log('Frontend: Upload response:', response.data)
            
            if (response.status === 200) {
                console.log('File uploaded successfully')
                setAgent({
                    ...agent,
                    knowledgeBaseAttached: true,
                })
                toast.success('File uploaded successfully')
            } else {
                console.error('Failed to upload file, status:', response.status)
                toast.error('Failed to upload file')
            }
        } catch (error: any) {
            console.error('Frontend: Error uploading file:', error)
            console.error('Frontend: Error code:', error.code)
            console.error('Frontend: Error name:', error.name)
            
            if (error.code === 'ERR_NETWORK' || error.name === 'TypeError' || error.message.includes('CORS')) {
                console.error('CORS or network issue detected')
                toast.error(`CORS Error: Azure service at ${url} needs to allow requests from ${window.location.origin}`)
            } else if (error.code === 'ECONNABORTED') {
                console.error('Request timeout')
                toast.error('Upload timeout - the file might be too large or the service is slow')
            } else {
                console.error('Frontend: Error response:', error.response?.data)
                console.error('Frontend: Error status:', error.response?.status)
                toast.error(`Upload error: ${error.response?.data?.message || error.message}`)
            }
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            uploadFile(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const testAzureConnectivity = async () => {
        try {
            console.log('Testing direct Azure service connectivity...')
            const url = process.env.NEXT_PUBLIC_AZURE_URL
            console.log('Testing URL:', url)
            
            // Test direct connection from client-side
            const response = await fetch(url!, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            
            console.log('Direct Azure test result:', response.status, response.statusText)
            
            if (response.ok) {
                toast.success('Azure service is reachable directly!')
            } else {
                toast.error(`Azure service returned: ${response.status} ${response.statusText}`)
            }
        } catch (error: any) {
            console.error('Direct connectivity test failed:', error)
            if (error.message.includes('CORS') || error.name === 'TypeError') {
                toast.error('CORS issue: Azure service needs to allow your domain')
            } else {
                toast.error(`Connection failed: ${error.message}`)
            }
        }
    }

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>Upload PDF for Knowledge Base</label>
                    <div className='flex gap-2'>
                        <Button
                            onClick={handleUploadClick}
                            variant='default'
                            size='sm'
                            className='rounded-[2px]'
                            disabled={isUploading}
                        >
                            <Upload className='w-4 h-4' />
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                        <Button
                            onClick={testAzureConnectivity}
                            variant='secondary'
                            size='sm'
                            className='rounded-[2px]'
                        >
                            Test Connection
                        </Button>
                        <input
                            ref={fileInputRef}
                            type='file'
                            onChange={handleFileSelect}
                            className='hidden'
                            accept='.pdf'
                        />
                    </div>
                    <p className='text-xs text-gray-500'>
                        Supported formats: .pdf only
                    </p>
                    <p className='text-xs text-gray-500'>
                        {selectedFile?.name || "No file selected"}
                    </p>
                </div>
            </div>
        </div>
    )
}

const Tools = ({ agent, setAgent }: { agent: Agent, setAgent: (agent: Agent) => void }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleFileUpload = (file: File) => {
        console.log('File uploaded:', file.name)
        // TODO: Implement file upload logic
        // This could involve sending the file to an API endpoint
        // and storing the file reference in the agent configuration
    }

    return (
        <div className='border border-gray-200 rounded-lg'>
            <header 
                className='cursor-pointer bg-gray-100 p-2'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Wrench className='w-3.5 h-3.5 text-gray-900 self-center' />
                        <h2 className='text-md text-gray-900'>
                            Tools
                        </h2>
                    </div>
                    <Triangle 
                        className={`w-3 h-3 self-center ${isOpen ? "rotate-180" : "rotate-90"}`}
                        style={{ fill: "lightgray" }}
                    />
                </div>
            </header>
            {isOpen && (
                <div className='p-4'>
                    <ToolsContent agentId={agent.agentId} agent={agent} setAgent={setAgent} />
                </div>
            )}
        </div>
    )
}

export default Tools

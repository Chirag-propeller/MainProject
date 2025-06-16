import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Starting upload-pdf request')
    
    // Get the Azure URL from environment
    const azureUrl = process.env.NEXT_PUBLIC_AZURE_URL
    console.log('API Route: Azure URL exists:', !!azureUrl, azureUrl)

    if (!azureUrl) {
      console.error('API Route: NEXT_PUBLIC_AZURE_URL environment variable not set')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Azure URL not configured' 
      }, { status: 500 })
    }

    // Get the formData from the request
    const formData = await request.formData()
    console.log('API Route: Received form data with keys:', Array.from(formData.keys()))

    // Make the request to Azure service using axios
    const targetUrl = `${azureUrl}/upload-pdf`
    console.log('API Route: Making request to:', targetUrl)

    try {
      const response = await axios.post(targetUrl, formData, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': 'supersecretapikey123',
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 second timeout
        maxRedirects: 5
      })

      console.log('API Route: Azure response status:', response.status)
      console.log('API Route: Azure response data:', response.data)

      return NextResponse.json(response.data)

    } catch (axiosError: any) {
      console.error('API Route: Axios error:', axiosError.message)
      console.error('API Route: Axios error code:', axiosError.code)
      console.error('API Route: Axios error response:', axiosError.response?.data)
      console.error('API Route: Axios error status:', axiosError.response?.status)

      if (axiosError.response) {
        // Server responded with error status
        return NextResponse.json({ 
          error: 'Azure service error',
          details: axiosError.response.data || `HTTP ${axiosError.response.status}`
        }, { status: axiosError.response.status })
      } else if (axiosError.request) {
        // Request was made but no response received
        return NextResponse.json({ 
          error: 'Network error',
          details: 'No response from Azure service - this might be a CORS or network issue'
        }, { status: 502 })
      } else {
        // Something else happened
        return NextResponse.json({ 
          error: 'Request setup error',
          details: axiosError.message
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('API Route: Unexpected error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 })
  }
} 
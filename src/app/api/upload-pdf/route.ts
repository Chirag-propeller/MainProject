import { NextRequest, NextResponse } from 'next/server'

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

    // Make the request to Azure service
    const targetUrl = `${azureUrl}/upload-pdf`
    console.log('API Route: Making request to:', targetUrl)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-api-key': 'supersecretapikey123'
      },
      body: formData
    })

    console.log('API Route: Azure response status:', response.status)
    console.log('API Route: Azure response headers:', Object.fromEntries(response.headers.entries()))

    // Handle the response
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      try {
        const errorBody = await response.text()
        console.error('API Route: Azure error body:', errorBody)
        errorMessage += `: ${errorBody}`
      } catch (e) {
        console.error('API Route: Could not read error body:', e)
      }
      
      return NextResponse.json({ 
        error: 'Azure service error',
        details: errorMessage 
      }, { status: response.status })
    }

    // Parse successful response
    const responseText = await response.text()
    console.log('API Route: Azure response body:', responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      console.error('API Route: Could not parse JSON response:', e)
      responseData = { message: responseText }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('API Route: Unexpected error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 })
  }
} 
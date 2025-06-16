import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const azureUrl = process.env.NEXT_PUBLIC_AZURE_URL
  
  if (!azureUrl) {
    return NextResponse.json({ error: 'Azure URL not configured' }, { status: 500 })
  }

  try {
    console.log('Testing Azure service reachability...')
    
    // Test 1: Basic connectivity test (just GET the root)
    const rootResponse = await axios.get(azureUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Test-Client'
      }
    })
    
    console.log('Root endpoint status:', rootResponse.status)
    
    // Test 2: Check if upload-pdf endpoint exists (HEAD request)
    let uploadEndpointExists = false
    try {
      const headResponse = await axios.head(`${azureUrl}/upload-pdf`, { 
        timeout: 5000 
      })
      uploadEndpointExists = true
      console.log('Upload endpoint HEAD status:', headResponse.status)
    } catch (headError: any) {
      console.log('Upload endpoint HEAD failed:', headError.response?.status || headError.code)
    }

    return NextResponse.json({
      success: true,
      azureUrl,
      rootEndpoint: {
        status: rootResponse.status,
        reachable: true
      },
      uploadEndpoint: {
        exists: uploadEndpointExists,
        tested: true
      },
      message: 'Azure service connectivity test completed'
    })

  } catch (error: any) {
    console.error('Azure service test failed:', error.message)
    
    return NextResponse.json({
      success: false,
      azureUrl,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      message: 'Azure service is not reachable'
    }, { status: 500 })
  }
} 
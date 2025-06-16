import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing external HTTP request...')
    
    // Test a simple external API call
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'User-Agent': 'Azure-Static-Web-App-Test'
      }
    })

    console.log('External request status:', response.status)
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'External HTTP request works',
      testResponse: data
    })

  } catch (error) {
    console.error('External request failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'External HTTP requests may be blocked in this environment'
    }, { status: 500 })
  }
} 
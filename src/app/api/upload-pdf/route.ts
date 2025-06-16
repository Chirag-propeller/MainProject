import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const azureUrl = process.env.NEXT_PUBLIC_AZURE_URL

    if (!azureUrl) {
      return NextResponse.json(
        { error: 'Azure URL not configured' },
        { status: 500 }
      )
    }

    // Forward the request to the Azure service
    const response = await fetch(`${azureUrl}/upload-pdf`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-api-key': 'supersecretapikey123'
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Azure service responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Proxy upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API route is working',
    azureUrlExists: !!process.env.NEXT_PUBLIC_AZURE_URL,
    azureUrl: process.env.NEXT_PUBLIC_AZURE_URL ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
} 
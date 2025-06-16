import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    azureUrl: process.env.NEXT_PUBLIC_AZURE_URL || 'NOT_SET',
    azureUrlExists: !!process.env.NEXT_PUBLIC_AZURE_URL,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('AZURE') || key.includes('PUBLIC')),
    timestamp: new Date().toISOString(),
    message: 'Environment debug info'
  })
} 
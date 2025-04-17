// /src/app/api/knowledgeBase/route.ts
import '@/model/knowledgeBase/file.model'
import '@/model/knowledgeBase/link.model'
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'


export async function GET() {
  try {
    await dbConnect()

    const knowledgeBases = await knowledgeBaseModel.find()
    .populate({ path: 'files', strictPopulate: false })  // Add this
    .populate({ path: 'links', strictPopulate: false })

    return NextResponse.json({ knowledgeBases }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch knowledge bases:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

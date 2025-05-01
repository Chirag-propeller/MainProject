// /src/app/api/knowledgeBase/route.ts
import '@/model/knowledgeBase/file.model'
import '@/model/knowledgeBase/link.model'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import { getUserFromRequest } from '@/lib/auth'


export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req);

    const knowledgeBases = await knowledgeBaseModel.find({userId : user.userId})
    .populate({ path: 'files', strictPopulate: false })  // Add this
    .populate({ path: 'links', strictPopulate: false })

    return NextResponse.json({ knowledgeBases }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch knowledge bases:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

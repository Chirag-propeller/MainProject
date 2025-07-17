import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import fileModel from '@/model/knowledgeBase/file.model'
import linkModel from '@/model/knowledgeBase/link.model'
import { uploadFileToAzure } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'
import User from '@/model/user/user.model'
import Agent from '@/model/agent'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req);
    const formData = await req.formData()
    console.log(formData);
    const file = formData.get('file') as File
    const agentId = formData.get('agentId') as string

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log(buffer);
    const azureUrl = await uploadFileToAzure(buffer, file.name)

    const dbFile = await fileModel.create({
      agentId: agentId,
      name: file.name,
      url: azureUrl,
      size: file.size,
      type: file.type,
      source: 'upload',
      userId: user.userId
    })
    
    return NextResponse.json({
      success: true,
      url: azureUrl,
      filename: file.name,
      fileId: dbFile._id
    })
  } catch (err: any) {
    console.error('Upload error:', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req);
    const { agentId } = await req.json()
    console.log("Received agentId:", agentId)

    if (!agentId) {
      return NextResponse.json({ success: false, error: 'Agent ID is required' }, { status: 400 })
    }

    // Find the agent by MongoDB ObjectId to ensure it belongs to the user
    const agent = await Agent.findOne({ _id: agentId, userId: user.userId })
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found or unauthorized' }, { status: 404 })
    }

    // Remove knowledge base files associated with this agent (using MongoDB ObjectId)
    await fileModel.deleteMany({ agentId: agentId })

    // Update agent to remove knowledge base references (using MongoDB ObjectId)
    await Agent.findOneAndUpdate(
      { _id: agentId },
      { 
        knowledgeBaseAttached: false,
        knowledgeBaseUrl: ""
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Knowledge base deleted successfully' 
    })
  } catch (err: any) {
    console.error('Delete error:', err?.message || err)
    return NextResponse.json({ 
      success: false, 
      error: err?.message || 'Delete failed' 
    }, { status: 500 })
  }
}
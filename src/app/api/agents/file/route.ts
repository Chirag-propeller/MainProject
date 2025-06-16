import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import fileModel from '@/model/knowledgeBase/file.model'
import linkModel from '@/model/knowledgeBase/link.model'
import { uploadFileToAzure } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'
import User from '@/model/user/user.model'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req);
    const formData = await req.formData()
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
    })
    // Step 3: Handle file uploads (multiple supported)
    // const uploadedFiles = []
    // for (const entry of formData.entries()) {
    //   const [key, value] = entry
    //   if (key === 'file' && typeof(value) === "object") {
    //     const arrayBuffer = await value.arrayBuffer()
    //     const buffer = Buffer.from(arrayBuffer)
    //     console.log(buffer);
    //     const azureUrl = await uploadFileToAzure(buffer, value.name)

    //     const dbFile = await fileModel.create({
    //       name: value.name,
    //       url: azureUrl,
    //       size: value.size,
    //       type: value.type,
    //       source: 'upload',
    //     })

    //     uploadedFiles.push(dbFile)
    //   }
    // }
    
    return NextResponse.json({
      success: true,
      url: azureUrl,
    })
  } catch (err: any) {
    console.error('Upload error:', err?.message || err)
    console.error('Full Error:', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
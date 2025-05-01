import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import fileModel from '@/model/knowledgeBase/file.model'
import linkModel from '@/model/knowledgeBase/link.model'
import User from '@/model/user/user.model'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req)
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 })
    }

    const kb = await knowledgeBaseModel.findById(id)

    if (!kb || kb.userId.toString() !== user.userId.toString()) {
      return NextResponse.json({ success: false, error: 'Unauthorized or not found' }, { status: 403 })
    }

    // Delete all associated files and links
    await fileModel.deleteMany({ knowledgeBaseId: id })
    await linkModel.deleteMany({ knowledgeBaseId: id })

    // Delete the knowledge base itself
    await knowledgeBaseModel.findByIdAndDelete(id)

    // Also pull it from user model (if stored)
    await User.findByIdAndUpdate(user.userId, { $pull: { knowledgeBases: id } })

    return NextResponse.json({ success: true, message: 'Knowledge base deleted' })
  } catch (err: any) {
    console.error('Error deleting KB:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

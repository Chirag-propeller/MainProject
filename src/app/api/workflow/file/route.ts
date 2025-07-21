import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import fileModel from '@/model/knowledgeBase/file.model';
import { uploadFileToAzure } from '@/lib/azure';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const workflowId = formData.get('workflowId') as string;
    const nodeId = formData.get('nodeId') as string;

    if (!file || !workflowId || !nodeId) {
      return NextResponse.json({ success: false, error: 'Missing file, workflowId, or nodeId' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const azureUrl = await uploadFileToAzure(buffer, file.name);

    const dbFile = await fileModel.create({
      workflowId,
      nodeId,
      name: file.name,
      url: azureUrl,
      size: file.size,
      type: file.type,
      source: 'workflow-upload',
      userId: user.userId,
    });

    return NextResponse.json({
      success: true,
      url: azureUrl,
      filename: file.name,
      fileId: dbFile._id,
    });
  } catch (err: any) {
    console.error('Workflow file upload error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
} 
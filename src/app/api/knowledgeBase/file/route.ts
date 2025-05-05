import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import File from '@/model/knowledgeBase/file.model';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const knowledgeBaseId = searchParams.get('knowledgeBaseId');
    
    if (!knowledgeBaseId) {
      return NextResponse.json(
        { error: 'Knowledge base ID is required' },
        { status: 400 }
      );
    }

    const files = await File.find({ 
      knowledgeBaseId
    });

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    const body = await req.json();
    
    const { name, path, url, size, type, source, knowledgeBaseId } = body;

    if (!name || !knowledgeBaseId) {
      return NextResponse.json(
        { error: 'Name and knowledge base ID are required' },
        { status: 400 }
      );
    }

    const file = await File.create({
      name,
      path,
      url,
      size,
      type,
      source: source || 'upload',
      knowledgeBaseId,
      userId: user.userId
    });

    return NextResponse.json({ file }, { status: 201 });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const file = await File.findOneAndDelete({
      _id: fileId,
      userId: user.userId
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
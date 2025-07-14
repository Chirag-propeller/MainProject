import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/model/workflow/workflow.model';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const user = await getUserFromRequest(req);
    const { name } = body;
    
    // Create a new empty workflow
    const newWorkflow = await Workflow.create({
      userId: user.userId,
      name: name?.trim() || "New Workflow",
      nodes: [],
      edges: [],
      nodeCounter: 1,
      edgeCounter: 1,
      globalPrompt: "",
      globalNodes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('New workflow created:', newWorkflow);

    return NextResponse.json({ 
      success: true, 
      data: newWorkflow 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create workflow' 
    }, { status: 500 });
  }
} 
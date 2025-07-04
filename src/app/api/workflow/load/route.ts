import { NextRequest, NextResponse } from 'next/server';

import Workflow from '@/model/workflow/workflow.model';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user's workflow
    const workflow = await Workflow.findOne({ userId }).sort({ updatedAt: -1 });

    if (!workflow) {
      return NextResponse.json({
        success: true,
        message: 'No workflow found for user',
        data: {
          nodes: [],
          edges: [],
          nodeCounter: 1,
          edgeCounter: 1,
          globalPrompt: ''
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow loaded successfully',
      data: {
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter,
        edgeCounter: workflow.edgeCounter,
        workflowId: workflow._id,
        name: workflow.name,
        globalPrompt: workflow.globalPrompt,
        updatedAt: workflow.updatedAt
      }
    });

  } catch (error) {
    console.error('Error loading workflow:', error);
    return NextResponse.json(
      { error: 'Failed to load workflow' },
      { status: 500 }
    );
  }
} 
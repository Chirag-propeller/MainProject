import { NextRequest, NextResponse } from 'next/server';

import Workflow from '@/model/workflow/workflow.model';
import dbConnect from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getUserFromRequest(req);
    const userId = user.userId;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required to load workflows from database' },
        { status: 400 }
      );
    }

    // Find all workflows for the user
    const workflows = await Workflow.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id name globalPrompt nodes edges nodeCounter edgeCounter globalNodes config createdAt updatedAt');

    return NextResponse.json({
      success: true,
      message: 'Workflows loaded successfully',
      data: workflows
    });

  } catch (error) {
    console.error('Error loading workflows:', error);
    return NextResponse.json(
      { error: 'Failed to load workflows' },
      { status: 500 }
    );
  }
} 
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

    // Find all workflows for the user
    const workflows = await Workflow.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id name globalPrompt nodes edges nodeCounter edgeCounter globalNodes createdAt updatedAt');

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
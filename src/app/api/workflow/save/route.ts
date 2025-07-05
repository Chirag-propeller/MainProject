import { NextRequest, NextResponse } from 'next/server';

import Workflow from '@/model/workflow/workflow.model';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { userId, name, nodes, edges, nodeCounter, edgeCounter, globalPrompt, globalNodes } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has a workflow, update it or create new one
    let workflow = await Workflow.findOne({ userId });

    if (workflow) {
      // Update existing workflow
      workflow.name = name || workflow.name;
      workflow.nodes = nodes || [];
      workflow.edges = edges || [];
      workflow.nodeCounter = nodeCounter || 1;
      workflow.edgeCounter = edgeCounter || 1;
      workflow.globalPrompt = globalPrompt || '';
      workflow.globalNodes = globalNodes || [];
      workflow.updatedAt = new Date();
      
      await workflow.save();
    } else {
      // Create new workflow
      workflow = new Workflow({
        userId,
        name: name || 'Untitled Workflow',
        nodes: nodes || [],
        edges: edges || [],
        nodeCounter: nodeCounter || 1,
        edgeCounter: edgeCounter || 1,
        globalPrompt: globalPrompt || '',
        globalNodes: globalNodes || []
      });
      
      await workflow.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow saved successfully',
      workflowId: workflow._id,
      data: {
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter,
        edgeCounter: workflow.edgeCounter,
        globalPrompt: workflow.globalPrompt,
        globalNodes: workflow.globalNodes
      }
    });

  } catch (error) {
    console.error('Error saving workflow:', error);
    return NextResponse.json(
      { error: 'Failed to save workflow' },
      { status: 500 }
    );
  }
} 
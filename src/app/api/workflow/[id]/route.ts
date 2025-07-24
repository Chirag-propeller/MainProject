import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workflow from '@/model/workflow/workflow.model';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    await dbConnect();
    const { id } = await params;
    
    const workflow = await Workflow.findOne({ _id: id, userId: user.userId });
    
    if (!workflow) {
      return NextResponse.json({ 
        success: false,
        error: 'Workflow not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        nodes: workflow.nodes,
        edges: workflow.edges,
        nodeCounter: workflow.nodeCounter,
        edgeCounter: workflow.edgeCounter,
        workflowId: workflow._id,
        name: workflow.name,
        globalPrompt: workflow.globalPrompt,
        globalNodes: workflow.globalNodes,
        globalVariables: workflow.globalVariables,
        config: workflow.config,
        updatedAt: workflow.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch workflow' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const user = await getUserFromRequest(request);
    
    const updatedWorkflow = await Workflow.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedWorkflow) {
      return NextResponse.json({ 
        success: false,
        error: 'Workflow not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedWorkflow,
      message: 'Workflow updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update workflow' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await getUserFromRequest(request);
    
    const deletedWorkflow = await Workflow.findOneAndDelete({
      _id: id,
      userId: user.userId
    });
    
    if (!deletedWorkflow) {
      return NextResponse.json({ 
        success: false,
        error: 'Workflow not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully',
      data: {
        deletedWorkflowId: id,
        deletedWorkflowName: deletedWorkflow.name
      }
    });
    
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete workflow' 
    }, { status: 500 });
  }
} 
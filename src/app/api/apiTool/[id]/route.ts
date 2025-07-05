import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VoiceAgentApi from '@/model/api';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/voice-agent-api/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  const { id } = await params;

  const api = await VoiceAgentApi.findOne({
    _id: id,
    userId: user.userId,
  });

  if (!api)
    return NextResponse.json({ message: 'API not found' }, { status: 404 });

  return NextResponse.json(api);
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  const { id } = await params;
  const body = await req.json();

  // Parse params field if sent as string
  if (body.params && typeof body.params === 'string') {
    try {
      body.params = JSON.parse(body.params);
    } catch (error) {
      console.error('Error parsing params string:', error);
      body.params = [];
    }
  }

  // Validate params structure
  if (body.params && Array.isArray(body.params)) {
    body.params = body.params.map((param: any) => ({
      name: param.name || '',
      type: param.type || 'string',
      required: Boolean(param.required),
      description: param.description || ''
    }));
  }

  // Only update the fields that should be updated, exclude MongoDB fields
  const updateData = {
    apiName: body.apiName,
    description: body.description,
    endpoint: body.endpoint,
    method: body.method,
    headers: body.headers,
    urlParams: body.urlParams,
    params: body.params,
    response: body.response,
    updatedAt: new Date()
  };

  console.log('Updating API with data:', JSON.stringify(updateData, null, 2));

  try {
    const updatedApi = await VoiceAgentApi.findOneAndUpdate(
      { _id: id, userId: user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedApi)
      return NextResponse.json({ message: 'API not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedApi });
  } catch (err) {
    console.error('Error updating API:', err);
    return NextResponse.json(
      { message: 'Failed to update API' },
      { status: 500 }
    );
  }
}

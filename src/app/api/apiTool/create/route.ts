import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VoiceAgentApi from "@/model/api";
import { getUserFromRequest } from '@/lib/auth';
import User from '@/model/user/user.model';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiName, endpoint, method } = body;

    // Handle params field - ensure it's an array
    if (body.params && typeof body.params === 'string') {
      try {
        body.params = JSON.parse(body.params);
      } catch (error) {
        console.error('Error parsing params string:', error);
        body.params = [];
      }
    }

    if (!apiName || !endpoint || !method) {
      return NextResponse.json(
        { success: false, error: 'apiName, endpoint and method are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await getUserFromRequest(req);

    // Only include the fields that should be created, exclude MongoDB fields
    const createData = {
      apiId: body.apiId || Date.now().toString(),
      userId: user.userId,
      apiName: apiName.trim() === '' ? 'My API' : apiName.trim(),
      description: body.description,
      endpoint: body.endpoint,
      method: body.method,
      headers: body.headers,
      urlParams: body.urlParams,
      params: body.params,
      response: body.response,
    };

    const newApi = await VoiceAgentApi.create(createData);

    // OPTIONAL – store reference on the user model
    await User.findByIdAndUpdate(user.userId, {
      $push: { voiceAgentApis: newApi._id },           // change field name if different
    });

    return NextResponse.json({ success: true, data: newApi }, { status: 201 });
  } catch (err) {
    console.error('Error creating API:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create API' },
      { status: 500 }
    );
  }
}

// app/api/agent/create/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import createCampaign from '@/model/createCampaign';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const newCampaign = await createCampaign.create({
    //   agentId: Date.now().toString(), // Temp incremental ID
    campaignCallId: body.campaignCallId || randomUUID(),
      ...body,
    });

    return NextResponse.json({ success: true, data: newCampaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating Campaign:', error);
    return NextResponse.json({ success: false, error: 'Failed to create Campaign' }, { status: 500 });
  }
}

// app/api/agent/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import createCampaign from '@/model/createCampaign'; // same model as used in create
import { getUserFromRequest } from '@/lib/auth';
import Contact from '@/model/campaign/contact.model';
import Agent from '@/model/agent';
// import Agent from '@/model/agent.model';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);
    const { _id, ...updateData } = body;
    const {agentId} = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Campaign ID is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await getUserFromRequest(req);
    const {contacts, ...rest} = body;
    console.log("contacts", contacts);
    console.log("body", body);
    if(contacts){
      if(contacts.length > 0){
        await Contact.deleteMany({campaignId: body._id});
        for(const contact of contacts){
          await Contact.create({
          userId: user.userId,
          campaignId: body._id,
          phonenumber: contact.phonenumber,
          metadata: contact.metadata,
          status: "pending",
          });
          console.log("contact", contact);
        }
      }
    }

    // Find campaign by ID and make sure it's owned by the user
    const campaign = await createCampaign.findOne({ _id: _id, userId: user.userId });

    if (!campaign) {
      return NextResponse.json({ success: false, error: 'Campaign not found or unauthorized' }, { status: 404 });
    }
    console.log("updateData", updateData);
    const agent = await Agent.findOne({agentId: agentId});
    console.log("agent", agent);
    // Update the campaign
    Object.assign(campaign, {...updateData, agent: agent});
    await campaign.save();

    return NextResponse.json({ success: true, data: campaign }, { status: 200 });
  } catch (error) {
    console.error('Error editing Campaign:', error);
    return NextResponse.json({ success: false, error: 'Failed to edit Campaign' }, { status: 500 });
  }
}

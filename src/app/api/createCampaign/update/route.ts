// app/api/agent/edit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import createCampaign from '@/model/createCampaign'; // same model as used in create
import { getUserFromRequest } from '@/lib/auth';
import Contact from '@/model/campaign/contact.model';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

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

    // Update the campaign
    Object.assign(campaign, updateData);
    await campaign.save();

    return NextResponse.json({ success: true, data: campaign }, { status: 200 });
  } catch (error) {
    console.error('Error editing Campaign:', error);
    return NextResponse.json({ success: false, error: 'Failed to edit Campaign' }, { status: 500 });
  }
}

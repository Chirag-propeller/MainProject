import { getUserFromRequest } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import createCampaign from "@/model/createCampaign";
import User from "@/model/user/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest){
    const body = await req.json();
    const {id} = body;
    if (!id) {
        return NextResponse.json({ success: false, error: 'Agent ID is required' }, { status: 400 });
      }
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);
        const campaign = await createCampaign.findById(id);
        if (campaign.userId.toString() !== user.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
          }
        await createCampaign.findByIdAndDelete(id);
        await User.findByIdAndUpdate(user.userId, { $pull: { campigns: id } });
        return NextResponse.json({ success: true, message: 'Campaign deleted successfully' }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({success : false, message: error.message, status: 500});
    }
}

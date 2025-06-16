import CampaignBackendSchema from "@/model/campaign/campaignBackend.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {campaignId} = await req.json();
    console.log(campaignId);
    const campaign = await CampaignBackendSchema.find({"campaign_id": campaignId});
    console.log(campaign);
    return NextResponse.json({message: "Campaign analytics fetched successfully", campaign});
}




// import dbConnect from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";
// import Contact from "@/model/campaign/contact.model";
// import mongoose from "mongoose";

// export async function POST(req: NextRequest) {

//     try{
//         await dbConnect();
//         const {campaignId} = await req.json();
//         console.log(campaignId);
//         const result = await Contact.aggregate([
//             {
//               $match: {
//                 campaignId: new mongoose.Types.ObjectId(campaignId),
//               },
//             },
//             {
//               $group: {
//                 _id: '$status',
//                 count: { $sum: 1 },
//               },
//             },
//           ]);
          
//           const callAnalysis: any = {};
//           let totalCalls = 0;
//           const statuses = ['success', 'failure', 'pending', 'active'];
//           for(const status of statuses){
//             callAnalysis[status] = 0;
//           }
//           for(const item of result){
//             if(statuses.includes(item._id as string)){
//                 callAnalysis[item._id as string] = item.count;
//             }
//             totalCalls += item.count;
//           }
//           callAnalysis['total'] = totalCalls;

//           console.log(callAnalysis);

//         return NextResponse.json(callAnalysis);
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({message: "Internal server error"}, {status: 500});
//     }
// }


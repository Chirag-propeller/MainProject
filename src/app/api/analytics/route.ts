import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OutBoundCall from '@/model/call/outBoundCall';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

  

export async function POST(req: NextRequest) {
//   const client = await MongoClient.connect(process.env.MONGO_URI!);
//   const db = client.db('yourdb');
  await dbConnect();
  // console.log("req" , req);
//   const collection = db.collection('outbound_call_data');
  

 
//   const pipeline = pipeline; // put aggregation pipeline from above
try {
  const temp = await req.json(); 
  const user = await getUserFromRequest(req);

  const data = temp.data;
  const matchConditions: Record<string, any> = {
    // call_analysis: { $exists: true, $ne: null },
  };
  // console.log("analytics data",data)
  if(data){
    console.log("data end date",data.endDate);
    if (data?.startDate && data?.endDate) {
      matchConditions.started_at_date = {
        $gte: new Date(data?.startDate),
        $lte: new Date(data?.endDate),
      };
    }
  }
  console.log("matchConditions analytics",matchConditions);
  const pipeline = [
    {
      $match: { user_id: new mongoose.Types.ObjectId(user.userId) }
  },
    {
      $addFields: {
        started_at_date: {
      $dateFromString: {
          dateString: "$started_at",
          format: "%Y-%m-%d %H:%M"
      }
      }
    },
    },
    {
      $match: matchConditions
      // {
      //   call_analysis: { $exists: true, $ne: null }
      // }
    },
     {
      $facet: {
        totalCalls: [ { $count: "count" } ],
  
        outboundCalls: [ 
          { $match: { "metadata.fromPhone": { $exists: true } } }, 
          { $count: "count" }
        ],
  
        inboundCalls: [ 
          { $match: { "metadata.fromPhone": { $exists: false } } }, 
          { $count: "count" }
        ],
  
        answeredOutbound: [
          { $match: { "metadata.fromPhone": { $exists: true }, "call_analysis.STATUS": "connected" } },
          { $count: "count" }
        ],
  
        answeredInbound: [
          { $match: { "metadata.fromPhone": { $exists: false }, "call_analysis.STATUS": "connected" } },
          { $count: "count" }
        ],
  
        outboundSentiment: [
          { $match: { "metadata.fromPhone": { $exists: true }, "call_analysis.STATUS": "connected" } },
          { $group: { _id: "$call_analysis.SENTIMENT", count: { $sum: 1 } } }
        ],
  
        inboundSentiment: [
          { $match: { "metadata.fromPhone": { $exists: false }, "call_analysis.STATUS": "connected" } },
          { $group: { _id: "$call_analysis.SENTIMENT", count: { $sum: 1 } } }
        ],
  
        outboundDisposition: [
          { $match: { "metadata.fromPhone": { $exists: true }, "call_analysis.STATUS": "connected" } },
          { $group: { _id: "$call_analysis.CALL_DISPOSITION", count: { $sum: 1 } } }
        ],
  
        inboundDisposition: [
          { $match: { "metadata.fromPhone": { $exists: false }, "call_analysis.STATUS": "connected" } },
          { $group: { _id: "$call_analysis.CALL_DISPOSITION", count: { $sum: 1 } } }
        ]
      }
    }
  
  ];

  const result = await OutBoundCall.aggregate(pipeline);
  //   console.log(result);
  
  return NextResponse.json(result[0]);
} catch (error:any) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}

}

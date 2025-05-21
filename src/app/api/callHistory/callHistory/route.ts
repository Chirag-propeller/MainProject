// import CallHistory from "@/model/call/callHistory.model";
// import dbConnect from "@/lib/mongodb";
// import { NextResponse, NextRequest } from "next/server";
// import OutBoundCall from "@/model/call/outBoundCall";
// import {  getUserFromRequest } from "@/lib/auth";
// import mongoose from "mongoose";
// export async function POST(req : NextRequest) {
//     await dbConnect();
//     try {
//         const user = await getUserFromRequest(req);
//         console.log(user);
//         const { filters } = await req.json();
//         console.log(filters);
//         // const data = await CallHistory.find({}).limit(100);\
//         const userId =  new mongoose.Types.ObjectId(user.userId)
//         const data = await OutBoundCall.find({user_id: userId});

//         return NextResponse.json({
//             success: true,
//             data
//         }, {status: 200})
//     } catch (error : any) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         }, {status: 500})
//     }
// }


// import CallHistory from "@/model/call/callHistory.model";
// import dbConnect from "@/lib/mongodb";
// import { NextResponse, NextRequest } from "next/server";
// import OutBoundCall from "@/model/call/outBoundCall";
// import { getUserFromRequest } from "@/lib/auth";
// import mongoose from "mongoose";

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const user = await getUserFromRequest(req);
//     const { filters } = await req.json();
//     console.log(filters);

//     const userId = new mongoose.Types.ObjectId(user.userId);

//     // Build the pipeline
//     const pipeline: any[] = [
//       {
//         $match: {
//           user_id: userId,
//         },
//       },
//     ];

//     // Apply filters dynamically
//     if (filters.agent && filters.agent.length > 0) {
//       pipeline.push({
//         $match: {
//           agent_id: { $in: filters.agent },
//         },
//       });
//     }

//     if (filters.status && filters.status.length > 0) {
//       pipeline.push({
//         $match: {
//           status: { $in: filters.status },
//         },
//       });
//     }

//     if (filters.sentiment && filters.sentiment.length > 0) {
//       pipeline.push({
//         $match: {
//           sentiment: { $in: filters.sentiment },
//         },
//       });
//     }

//     const data = await OutBoundCall.aggregate(pipeline);

//     return NextResponse.json(
//       {
//         success: true,
//         data,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { filters, dateRange } = await req.json();
    console.log(dateRange);

    const userId = new mongoose.Types.ObjectId(user.userId);

    // Start building the match object
    const matchStage: any = {
      user_id: userId,
    };

    // Agent ID is inside metadata.agentid
    if (filters.agent && filters.agent.length > 0) {
      matchStage["metadata.agentid"] = { $in: filters.agent };
    }

    // Call status is inside call_analysis.STATUS
    if (filters.status && filters.status.length > 0) {
      matchStage["call_analysis.STATUS"] = { $in: filters.status };
    }

    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      start.setHours(0, 0, 0, 0); // Start of day (local)
    
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999); // End of day (local)
    
      matchStage["started_at_date"] = {
        $gte: start,
        $lte: end,
      };

      // matchStage["started_at_date"] = {
      //   $gte: new Date(dateRange?.startDate),

      //   $lte: new Date(dateRange?.endDate),
      // };
    }

    // Sentiment is inside call_analysis.SENTIMENT
    if (filters.sentiment && filters.sentiment.length > 0) {
      matchStage["call_analysis.SENTIMENT"] = { $in: filters.sentiment };
    }

    const pipeline = [
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
      { $match: matchStage },

      // You can add sorting, pagination, projection, etc. here
    ];

    const data = await OutBoundCall.aggregate(pipeline);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

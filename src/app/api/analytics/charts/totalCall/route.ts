import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OutBoundCall from '@/model/call/outBoundCall';
import { PipelineStage } from 'mongoose';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';



  

export async function POST(req: NextRequest) {
//   const client = await MongoClient.connect(process.env.MONGO_URI!);
//   const db = client.db('yourdb');
    try {
        await dbConnect();
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }
//   const collection = db.collection('outbound_call_data');
    try {
        const user = await getUserFromRequest(req);
        const temp = await req.json();
        const data = temp.data;
        console.log("totalCall data",data);

    const match: Record<string, any> ={
        // call_analysis: { $exists: true, $ne: null },
    };
    //     {
    //         started_at_date: { $ne: null, $exists: true },
    //   };
      if(data.filters){
        const { startDate, endDate } = data.filters;
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // Start of day (local)
          
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // End of day (local)
            match.started_at_date = {
              $gte: start,
              $lte: end,
            };
          }
    }
      // 👇 Apply date filtering if present
      console.log("user",user)

      console.log("totalCall match",match)
        const pipeline : PipelineStage[]= [
            {
                $match: { started_at: { $ne: null, $exists: true }}
            },
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
            }
            },
            {
                $match: match
            },
            // {
            //     $match: {
            //       started_at_date: {
            //         ...(data?.startDate && data?.endDate && {
            //           $gte: new Date(data.startDate),
            //           $lte: new Date(data.endDate),
            //         }),
            //       },
            //     },
            //   },
            {
            $group: {
                _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$started_at_date"
                }
                },
                count: { $sum: 1 }
            }
            },
            {
            $sort: { _id: 1 }
            }
        ];
        //   const pipeline = pipeline; // put aggregation pipeline from above

        const result = await OutBoundCall.aggregate(pipeline);
        //   console.log(result);
        const formatted = result.map((item) => ({
        date: item._id,
        calls: item.count,
        }));
        console.log(formatted)
        return NextResponse.json({data:formatted}, {status:200});
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }

}

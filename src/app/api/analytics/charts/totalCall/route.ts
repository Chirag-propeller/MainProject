import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OutBoundCall from '@/model/call/outBoundCall';
import { PipelineStage } from 'mongoose';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
  

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }
//   const collection = db.collection('outbound_call_data');
    try {
        const user = await getUserFromRequest(req);
        const temp = await req.json();
        const data = temp?.data;
        const interval = temp?.interval || { unit: "day", binSize: 1 };
        // const interval = data.filters?.interval || { unit: "day", binSize: 1 };
        console.log("interval",interval);

        let groupStage: PipelineStage;

        if (interval.unit === "hour") {
        // Hourly or 2-hour bins
        groupStage = {
            $group: {
            _id: {
                $dateTrunc: {
                date: "$started_at_date",
                unit: "hour",
                binSize: interval.binSize || 1,
                timezone: "Asia/Kolkata",
                }
            },
            count: { $sum: 1 }
            }
        };
        } else if (interval.unit === "day") {
        groupStage = {
            $group: {
            _id: {
                $dateTrunc: {
                date: "$started_at_date",
                unit: "day",
                binSize: interval.binSize || 1,
                timezone: "Asia/Kolkata",
                }
            },
            count: { $sum: 1 }
            }
        };
        } else {
        // Fallback
        groupStage = {
            $group: {
            _id: {
                $dateToString: {
                format: "%Y-%m-%d",
                date: "$started_at_date",
                timezone: "Asia/Kolkata",
                }
            },
            count: { $sum: 1 }
            }
        };
        }

        // console.log("totalCall data",data);

    const match: Record<string, any> ={
        call_analysis: { $exists: true, $ne: null },
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
    if (data.filters.agent && data.filters.agent.length > 0) {
        match["metadata.agentid"] = { $in: data.filters.agent };
      }
  
      // Call status is inside call_analysis.STATUS
      if (data.filters.status && data.filters.status.length > 0) {
        match["call_analysis.STATUS"] = { $in: data.filters.status };
      }
      if (data.filters.sentiment && data.filters.sentiment.length > 0) {
        match["call_analysis.SENTIMENT"] = { $in: data.filters.sentiment };
      }
      // 👇 Apply date filtering if present
    //   console.log("user",match);

      console.log("totalCall match",match)
        const pipeline : PipelineStage[]= [
            {
                $match: { started_at: { $ne: null, $exists: true }}
            },
            {
                $match: { user_id: new mongoose.Types.ObjectId(user.userId) }
            },

            // {
            // $addFields: {
            //     started_at_date: {
            //     $dateFromString: {
            //         dateString: "$started_at",
            //         format: "%Y-%m-%d %H:%M",
            //         timezone: "Asia/Kolkata", 
            //     }
            //     }
            // }
            // },
            {
                $addFields: {
                  started_at_date: {
                    $cond: {
                      if: { $eq: [{ $type: "$started_at" }, "string"] },
                      then: {
                        $dateFromString: {
                          dateString: "$started_at",
                          format: "%Y-%m-%d %H:%M"
                        }
                      },
                      else: "$started_at"
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
            groupStage,
            // {
            // $group: {
            //     _id: {
            //     $dateToString: {
            //         format: "%Y-%m-%d",
            //         date: "$started_at_date"
            //     }
            //     },
            //     count: { $sum: 1 }
            // }
            // },
            {
            $sort: { _id: 1 }
            }
        ];
        //   const pipeline = pipeline; // put aggregation pipeline from above

        const result = await OutBoundCall.aggregate(pipeline);
        // console.log(result);
        let formatted;

        if(interval.unit === "hour"){
            let dataToSend;
            if(interval.binSize !== 1){
                dataToSend = [{date: "12 AM", calls: 0},{date: "2 AM", calls: 0},{date: "4 AM", calls: 0},{date: "6 AM", calls: 0},{date: "8 AM", calls: 0},{date: "10 AM", calls: 0},{date: "12 PM", calls: 0},{date: "2 PM", calls: 0},{date: "4 PM", calls: 0},{date: "6 PM", calls: 0},{date: "8 PM", calls: 0},{date: "10 PM", calls: 0}];
            }
            else{
                dataToSend = [{date: "12 AM", calls: 0},{date: "1 AM", calls: 0},{date: "2 AM", calls: 0},{date: "3 AM", calls: 0},{date: "4 AM", calls: 0},{date: "5 AM", calls: 0},{date: "6 AM", calls: 0},{date: "7 AM", calls: 0},{date: "8 AM", calls: 0},{date: "9 AM", calls: 0},{date: "10 AM", calls: 0},{date: "11 AM", calls: 0},{date: "12 PM", calls: 0},{date: "1 PM", calls: 0},{date: "2 PM", calls: 0},{date: "3 PM", calls: 0},{date: "4 PM", calls: 0},{date: "5 PM", calls: 0},{date: "6 PM", calls: 0},{date: "7 PM", calls: 0},{date: "8 PM", calls: 0},{date: "9 PM", calls: 0},{date: "10 PM", calls: 0},{date: "11 PM", calls: 0}];
            }
            formatted = result.map((item) => ({
            date: new Date(item._id).toLocaleString('en-US', { timeZone: 'Asia/Kolkata',  hour: 'numeric', hour12: true }),
            calls: item.count,
            }));
            for(let i = 0; i < formatted.length; i++){
                for(let j = 0; j < dataToSend.length; j++){
                    if(formatted[i].date === dataToSend[j].date){
                        dataToSend[j].calls = formatted[i].calls;
                    }
                }
            }

            console.log("formatted",dataToSend)
            return NextResponse.json({data:dataToSend}, {status:200});
        }
        else{
            const { startDate, endDate } = data.filters;

            const allDates = eachDayOfInterval({
              start: new Date(startDate),
              end: new Date(endDate),
            });

            const dateWanted = [];
            let x = 0;
            
            for (let i = 0; i < allDates.length; i += interval.binSize) {
                dateWanted.push(allDates[i]);
            }
            console.log("dateWanted",dateWanted);
          
            const formattedResult = result.map((item) => ({
              date: format(new Date(item._id), 'd MMM'), // e.g., 19 May
              calls: item.count
            }));
          
            const dataToSend = dateWanted.map((d) => {
              const formattedDate = format(d, 'd MMM');
              const found = formattedResult.find(item => item.date === formattedDate);
              return found || { date: formattedDate, calls: 0 };
            });
          
            return NextResponse.json({ data: dataToSend }, { status: 200 });



            // let dataToSend = [];
            formatted = result.map((item) => ({
            date: new Date(item._id).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', day:'numeric', month:'short'}),
            calls: item.count,
            }));
            console.log("formatted",formatted)
        }
        return NextResponse.json({data:formatted}, {status:200});
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }

}

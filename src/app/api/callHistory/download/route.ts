import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
import { unparse } from "papaparse";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { filters, dateRange } = await req.json();
    
    const userId = new mongoose.Types.ObjectId(user.userId);

    // Start building the match object
    const matchStage: any = {
      $or: [
        { user_id: userId },
        { user_id: user.userId }
      ]
    };
    matchStage.call_analysis = { $exists: true, $ne: null };

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
    }

    // Sentiment is inside call_analysis.SENTIMENT
    if (filters.sentiment && filters.sentiment.length > 0) {
      matchStage["call_analysis.SENTIMENT"] = { $in: filters.sentiment };
    }

    const pipeline = [
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
      { $match: matchStage },
      { $sort: { started_at_date: -1 as const } },
      
      {
        $lookup: {
          from: "aggregated_metrics", // collection name in MongoDB
          localField: "room_name", // field from OutBoundCall
          foreignField: "_id", // field from AggregatedMetrics  
          as: "Metrics" // output array field
        }
      },
      
      {
        $addFields: {
          cost: {
            $ifNull: [
              { $arrayElemAt: ["$Metrics.total_cost", 0] },
              0
            ]
          },
          avg_total_latency: {
            $ifNull: [
              { $arrayElemAt: ["$Metrics.avg_total_latency", 0] },
              0
            ]
          }
        }
      },
      
      {
        $project: {
          costMetrics: 0,
          Metrics: 0,
          user_id: 0,
          // any other fields you want to exclude
        }
      },
    ];

    const data = await OutBoundCall.aggregate(pipeline as any);

    if (data.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No data to export",
          data: "",
        },
        { status: 200 }
      );
    }

    // Flatten the data for CSV export
    const flattenedData = data.map(item => {
      const flatItem: any = { ...item };
      if (item.call_analysis) {
        Object.keys(item.call_analysis).forEach(key => {
          flatItem[`call_analysis_${key}`] = item.call_analysis[key];
        });
        delete flatItem.call_analysis;
      }
      if (item.metadata) {
        Object.keys(item.metadata).forEach(key => {
          flatItem[`metadata_${key}`] = item.metadata[key];
        });
        delete flatItem.metadata;
      }
      return flatItem;
    });

    const csv = unparse(flattenedData);

    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=call_history.csv",
      },
    });

    return response;

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

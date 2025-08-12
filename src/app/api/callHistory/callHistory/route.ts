import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { filters, dateRange, campaignId } = await req.json();
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
    // console.log(page, limit);
    // console.log(dateRange);

    const userId = new mongoose.Types.ObjectId(user.userId);

    // Start building the match object
    let matchStage: any = {
      $or: [
        { user_id: userId },
        { user_id: user.userId }
      ]
    };
    matchStage.call_analysis = { $exists: true, $ne: null };

    // Filter by campaign if provided (stored in metadata.campaign_id or campaignid)
    if (campaignId) {
      matchStage.$or = [
        ...(matchStage.$or || []),
      ];
      // Attach campaignId match; preserve existing $or by wrapping with $and
      const baseMatch = { ...matchStage };
      delete (baseMatch as any).$or;
      const userOr = matchStage.$or && Array.isArray(matchStage.$or) ? matchStage.$or : [];
      const campaignOr = [
        { "metadata.campaign_id": campaignId },
        { "metadata.campaignid": campaignId },
        { campaign_id: campaignId },
        { campaignid: campaignId },
      ];
      // Recompose with $and to keep both user and campaign filters
      matchStage = {
        $and: [
          { $or: userOr },
          { $or: campaignOr },
          { call_analysis: { $exists: true, $ne: null } },
        ],
      } as any;
    }

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
    // console.log("matchStage",matchStage);

    const pipeline = [
      // {
      //   $addFields: {
      //     started_at_date: {
      //     $dateFromString: {
      //       dateString: "$started_at",
      //       format: "%Y-%m-%d %H:%M"
      //   }
      //   }
      // },
      // },
      { $match: matchStage },
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
      
      // { $sort: { started_at_date: -1 as const } },

      // Lookup to join with AggregatedMetrics collection
      {
        $lookup: {
          from: "aggregated_metrics", // collection name in MongoDB
          localField: "room_name", // field from OutBoundCall
          foreignField: "_id", // field from AggregatedMetrics  
          as: "Metrics" // output array field
        }
      },

      // Add cost field from the joined data
      {
        $addFields: {
          cost: {
            $ifNull: [
              { $arrayElemAt: ["$Metrics.total_cost", 0] }, // Get total_cost from first matching document
              0 // default value if no match or total_cost is null
            ]
          },
          avg_total_latency: {
            $ifNull: [
              { $arrayElemAt: ["$Metrics.avg_total_latency", 0] }, // Get avg_total_latency from first matching document
              0 // default value if no match or avg_total_latency is null
            ]
          }
        }
      },

      // Remove the temporary costMetrics array to clean up the output
      {
        $project: {
          costMetrics: 0
        }
      },
      {
        $facet: {
          // Get total count
          totalCount: [
            { $count: "count" }
          ],
          // Get paginated data
          data: [
            { $sort: { started_at_date: -1 as const } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]
        }
      }

      // You can add sorting, pagination, projection, etc. here
    ];

    // const data = await OutBoundCall.aggregate(pipeline).skip((page - 1) * limit).limit(limit);
    // const result = await OutBoundCall.aggregate(pipeline as any, { allowDiskUse: true })
    const result = await OutBoundCall.aggregate(pipeline)
                                 .option({ allowDiskUse: true });

    const totalCount = result[0].totalCount[0]?.count || 0;
    const data = result[0].data || [];

    return NextResponse.json(
      {
        success: true,
        data: data,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1
        },
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

import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
import { unparse } from "papaparse";
import Agent from "@/model/agent";
import { format, parse } from "date-fns";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { filters, dateRange, selectedFields, campaignId } = await req.json();
    
    const userId = new mongoose.Types.ObjectId(user.userId);

    // Start building the match object
    let matchStage: any = {
      $or: [
        { user_id: userId },
        { user_id: user.userId }
      ]
    };
    matchStage.call_analysis = { $exists: true, $ne: null };

    // Optional campaign filter
    if (campaignId) {
      const userOr = matchStage.$or && Array.isArray(matchStage.$or) ? matchStage.$or : [];
      const campaignOr = [
        { "metadata.campaign_id": campaignId },
        { "metadata.campaignid": campaignId },
        { campaign_id: campaignId },
        { campaignid: campaignId },
      ];
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





    // Fetch agent data for field resolution
    const agentOptions = await Agent.find({ userId: user.userId });

    // Helper functions for data transformation (same as Table component)
    function formatDateTime(dateStr: string): string {
      const parsed = parse(dateStr, "yyyy-MM-dd HH:mm", new Date());
      return format(parsed, "hh:mm a - dd MMM, yyyy");
    }
    
    function parseApiDate(dateStr: string): Date {
      return parse(dateStr, "yyyy-MM-dd HH:mm", new Date());
    }

    // Format transcript for CSV export
    function formatTranscriptForCSV(transcript: any): string {
      if (!transcript?.items || !Array.isArray(transcript.items)) {
        return "No transcript available";
      }
      
      return transcript.items.map((item: any) => {
        if (!item.content?.length) return '';
        const role = item.role === 'user' ? 'User' : 'Agent';
        const content = Array.isArray(item.content) ? item.content.join(' ') : item.content;
        return `${role}: ${content}`;
      }).filter(Boolean).join(' | ');
    }

    // Transform data same as Table component
    const mappedData = data
      .filter((item: any) => item.call_analysis)
      .map((item: any) => {
        const callAnalysis = item.call_analysis || {};
        const metadata = item.metadata || {};
        const parsedDate = parseApiDate(item.started_at);
        const agent = agentOptions.find((agent: any) => agent.agentId === metadata.agentid);
        const llm = agent?.llm ? `${agent?.llm} (${agent?.llmModel})` : "N/A";
        const stt = agent?.stt ? `${agent?.stt} ` : "N/A";
        const tts = agent?.tts ? `${agent?.tts} (${agent?.ttsModel})` : "N/A";
        let call_duration = "-";
        if (item.call_duration_in_sec) {
          const minutes = Math.floor(item.call_duration_in_sec / 60);
          const seconds = item.call_duration_in_sec % 60;
          if (minutes > 0) {
            call_duration = `${minutes}m ${seconds.toFixed(0)}s`;
          } else {
            call_duration = `${seconds.toFixed(0)}s`;
          }
        }

        // Normalize dataFields/trackingSetup structures to arrays of {key,value}
        const normalizeToArray = (value: any): Array<{ key: string; value: any }> | null => {
          if (!value) return null;
          if (Array.isArray(value)) return value;
          if (typeof value === "object") {
            try {
              return Object.entries(value).map(([key, val]) => ({ key, value: val }));
            } catch {
              return null;
            }
          }
          return null;
        };
        const normalizedDataFields = normalizeToArray(item?.dataFields || item?.call_analysis?.dataFields || null);
        const normalizedTrackingSetup = normalizeToArray(item?.trackingSetup || item?.trackingsetup || null);

        return {
          // Root-level
          id: item._id,
          rawDate: parsedDate,
          started_at: formatDateTime(item.started_at),
          phonenumber: item.phonenumber,
          room_name: item.room_name,
          user_id: item.user_id,
          from_phonenumber: metadata.fromPhone,

          // Metadata
          agent: agent?.agentName,
          llm: llm,
          stt: stt,
          tts: tts,
          fromPhone: metadata.fromPhone,
          numberoffollowup: metadata.numberoffollowup,
          total_followup_count: metadata.total_followup_count,
          average_latency: item.avg_total_latency,

          // Call Analysis
          status: callAnalysis.STATUS,
          language: callAnalysis.LANGUAGE,
          call_quality_score: callAnalysis.CALL_QUALITY_SCORE,
          sentiment: callAnalysis.SENTIMENT,
          script_adherence_score: callAnalysis.SCRIPT_ADHERENCE_SCORE,
          call_disposition: callAnalysis.CALL_DISPOSITION,
          call_transfer: callAnalysis.CALL_TRANSFER,
          escalation_flag: callAnalysis.ESCALATION_FLAG,
          ai_confidence_score: callAnalysis.AI_CONFIDENCE_SCORE,
          nlp_error_rate: callAnalysis.NLP_ERROR_RATE,
          intent_detected: callAnalysis.INTENT_DETECTED,
          intent_success_rate: callAnalysis.INTENT_SUCCESS_RATE,
          average_intent_turn: callAnalysis.AVERAGE_INTENT_TURN,
          lead_score: callAnalysis.LEAD_SCORE,
          conversion_flag: callAnalysis.CONVERSION_FLAG,
          upsell_flag: callAnalysis.UPSELL_FLAG,
          cross_sell_flag: callAnalysis.CROSS_SELL_FLAG,
          survey_score: callAnalysis.SURVEY_SCORE,
          compliance_risk_score: callAnalysis.COMPLIANCE_RISK_SCORE,
          keyword_alert_count: callAnalysis.KEYWORD_ALERT_COUNT,
          pci_dss_sensitive_data_detected: callAnalysis.PCI_DSS_SENSITIVE_DATA_DETECTED,
          gdpr_data_request: callAnalysis.GDPR_DATA_REQUEST,
          customer_engagement_score: callAnalysis.CUSTOMER_ENGAGEMENT_SCORE,
          interruption_count: callAnalysis.INTERRUPTION_COUNT,
          reviewer_comments: callAnalysis.REVIEWER_COMMENTS,
          violations: callAnalysis.VIOLATIONS?.length || 0,
          cost: item.cost,
          call_direction: item.call_direction,
          call_duration: call_duration,
          call_type: item.call_type,
          transcript: formatTranscriptForCSV(item.call_transcript),
          llm_cost: item.llm_cost_rupees ? Number(item.llm_cost_rupees.toString()).toFixed(2) : "0.00",
          stt_cost: item.stt_cost_rupees ? Number(item.stt_cost_rupees.toString()).toFixed(2) : "0.00", 
          tts_cost: item.tts_cost_rupees ? Number(item.tts_cost_rupees.toString()).toFixed(2) : "0.00",
          goal_completion_status: callAnalysis.GOAL_COMPLETION_STATUS,
          dataFields: normalizedDataFields,
          trackingSetup: normalizedTrackingSetup,
        };
      });

    // Filter data by selected fields if provided
    let finalData = mappedData;
    if (selectedFields && selectedFields.length > 0) {
      finalData = mappedData.map(item => {
        const filteredItem: any = {};
        selectedFields.forEach((field: string) => {
          if (field.startsWith('dataFields.') || field.startsWith('trackingSetup.')) {
            const isDF = field.startsWith('dataFields.');
            const dynKey = field.split('.').slice(1).join('.');
            const group = isDF ? item.dataFields : item.trackingSetup;
            if (Array.isArray(group)) {
              const found = group.find((g: any) => (g.fieldName || g.key) === dynKey);
              filteredItem[field] = found ? (found.value ?? '') : '';
            } else {
              filteredItem[field] = '';
            }
          } else if (item.hasOwnProperty(field)) {
            filteredItem[field] = (item as any)[field];
          }
        });
        return filteredItem;
      });
    }

    const csv = unparse(finalData);

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

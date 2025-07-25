import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OutBoundCall from '@/model/call/outBoundCall';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

interface MetricResult {
  _id: string;
  count: number;
}

interface AIMetrics {
  avgNlpErrorRate: number;
  avgIntentSuccessRate: number;
  avgResolutionSuccess: number;
}

interface FacetResult {
  outboundDuration?: MetricResult[];
  inboundDuration?: MetricResult[];
  outboundDisposition?: MetricResult[];
  inboundDisposition?: MetricResult[];
  outboundAIMetrics?: AIMetrics[];
  inboundAIMetrics?: AIMetrics[];
  unansweredOutboundVoicemail?: MetricResult[];
  unansweredOutboundBusy?: MetricResult[];
  outboundSentiment?: MetricResult[];
  inboundSentiment?: MetricResult[];
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const temp = await req.json();
    const user = await getUserFromRequest(req);
    const data = temp.data;
    const matchConditions: Record<string, any> = {
      call_analysis: { $exists: true, $ne: null },
    };

    if (data) {
      if (data?.startDate && data?.endDate) {
        const start = new Date(data?.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(data?.endDate);
        end.setHours(23, 59, 59, 999);
        matchConditions.started_at_date = {
          $gte: start,
          $lte: end,
        };
      }
    }
    if (data.agent && data.agent.length > 0) {
      matchConditions["agent_config.agentId"] = { $in: data.agent };
    }
    if (data.status && data.status.length > 0) {
      matchConditions["call_analysis.STATUS"] = { $in: data.status };
    }
    if (data.sentiment && data.sentiment.length > 0) {
      matchConditions["call_analysis.SENTIMENT"] = { $in: data.sentiment };
    }

    // 1. Time-series metrics for cards
    const timeSeriesPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$started_at_date" }
          },
          totalCallMinutes: { $sum: { $divide: ["$call_duration_in_sec", 60] } },
          numberOfCalls: { $sum: 1 },
          totalSpent: {
            $sum: {
              $add: [
                { $toDouble: { $ifNull: ["$llm_cost_rupees", 0] }},
                { $toDouble: { $ifNull: ["$stt_cost_rupees", 0] }},
                { $toDouble: { $ifNull: ["$tts_cost_rupees", 0] }},
                {
                  $cond: [
                    {
                      $or: [
                        { $ne: [{ $ifNull: ["$llm_cost_rupees", null] }, null] },
                        { $ne: [{ $ifNull: ["$stt_cost_rupees", null] }, null] },
                        { $ne: [{ $ifNull: ["$tts_cost_rupees", null] }, null] }
                      ]
                    },
                    1.7,
                    0
                  ]
                }
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];

    // 2. Facet-based pipeline for diagram and other stats
    const facetPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
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
          // Outbound Duration
          outboundDuration: [
            { $match: { 
              "metadata.fromPhone": { $exists: true }, 
              "call_analysis.STATUS": "connected" 
            }},
            {
              $group: {
                _id: {
                  $switch: {
                    branches: [
                      { case: { $lte: ["$call_duration_in_sec", 10] }, then: "lessThan10sec" },
                      { case: { $and: [
                        { $gt: ["$call_duration_in_sec", 10] },
                        { $lte: ["$call_duration_in_sec", 60] }
                      ]}, then: "10secTo1min" }
                    ],
                    default: "moreThan1min"
                  }
                },
                count: { $sum: 1 }
              }
            }
          ],
          // Inbound Duration
          inboundDuration: [
            { $match: { 
              "metadata.fromPhone": { $exists: false }, 
              "call_analysis.STATUS": "connected" 
            }},
            {
              $group: {
                _id: {
                  $switch: {
                    branches: [
                      { case: { $lte: ["$call_duration_in_sec", 10] }, then: "lessThan10sec" },
                      { case: { $and: [
                        { $gt: ["$call_duration_in_sec", 10] },
                        { $lte: ["$call_duration_in_sec", 60] }
                      ]}, then: "10secTo1min" }
                    ],
                    default: "moreThan1min"
                  }
                },
                count: { $sum: 1 }
              }
            }
          ],
          // Outbound Call Disposition
          outboundDisposition: [
            { $match: { 
              "metadata.fromPhone": { $exists: true }, 
              "call_analysis.STATUS": "connected" 
            }},
            { 
              $group: { 
                _id: "$call_analysis.CALL_DISPOSITION", 
                count: { $sum: 1 } 
              } 
            }
          ],
          // Inbound Call Disposition
          inboundDisposition: [
            { $match: { 
              "metadata.fromPhone": { $exists: false }, 
              "call_analysis.STATUS": "connected" 
            }},
            { 
              $group: { 
                _id: "$call_analysis.CALL_DISPOSITION", 
                count: { $sum: 1 } 
              } 
            }
          ],
          // Outbound AI Metrics (average)
          outboundAIMetrics: [
            { $match: { 
              "metadata.fromPhone": { $exists: true }, 
              "call_analysis.STATUS": "connected" 
            }},
            {
              $group: {
                _id: null,
                avgNlpErrorRate: { $avg: "$call_analysis.NLP_ERROR_RATE" },
                avgIntentSuccessRate: { $avg: "$call_analysis.INTENT_SUCCESS_RATE" },
                avgResolutionSuccess: { $avg: { $cond: [{ $eq: ["$call_analysis.ESCALATION_FLAG", false] }, 1, 0] } }
              }
            }
          ],
          // Inbound AI Metrics (average)
          inboundAIMetrics: [
            { $match: { 
              "metadata.fromPhone": { $exists: false }, 
              "call_analysis.STATUS": "connected" 
            }},
            {
              $group: {
                _id: null,
                avgNlpErrorRate: { $avg: "$call_analysis.NLP_ERROR_RATE" },
                avgIntentSuccessRate: { $avg: "$call_analysis.INTENT_SUCCESS_RATE" },
                avgResolutionSuccess: { $avg: { $cond: [{ $eq: ["$call_analysis.ESCALATION_FLAG", false] }, 1, 0] } }
              }
            }
          ],
          unansweredOutboundVoicemail: [
            { $match: { "metadata.fromPhone": { $exists: true }, "call_status": "voicemail" } }, 
            { $count: "count" }
          ],
          unansweredOutboundBusy: [
            { $match: { "metadata.fromPhone": { $exists: true }, "call_status": "busy" } }, 
            { $count: "count" }
          ]
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];

    // 2. Cost Breakdown by Day
    const costBreakdownPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$started_at_date" } },
          llm: { $sum: { $toDouble: { $ifNull: ["$llm_cost_rupees", 0] }} },
          stt: { $sum: { $toDouble: { $ifNull: ["$stt_cost_rupees", 0] } } },
          tts: { $sum: { $toDouble: { $ifNull: ["$tts_cost_rupees", 0] } } }
        }
      },
      { $sort: { "_id": 1 as 1 } }
    ];

    // // Debug: Log a few documents to check cost fields
    // const sampleDocs = await OutBoundCall.find({ user_id: new mongoose.Types.ObjectId(user.userId) }).limit(5).lean();
    // console.log('Sample OutBoundCall docs:', sampleDocs.map(doc => ({
    //   llm_cost_rupees: doc.llm_cost_rupees,
    //   stt_cost_rupees: doc.stt_cost_rupees,
    //   tts_cost_rupees: doc.tts_cost_rupees,
    //   started_at: doc.started_at,
    //   _id: doc._id
    // })));
    // 4. Real-time Call Status Pipeline
    const realtimeCallStatusPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
      {
        $addFields: {
          callStatus: {
            $cond: {
              if: { $eq: ["$call_analysis.STATUS", "connected"] },
              then: "connected",
              else: "notConnected"
            }
          }
        }
      },
      {
        $group: {
          _id: "$callStatus",
          count: { $sum: 1 }
        }
      }
    ];

    // 5. Peak Times Pipeline
    const peakTimesPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
      {
        $group: {
          _id: {
            hour: { $hour: "$started_at_date" },
            dayOfWeek: { $dayOfWeek: "$started_at_date" }
          },
          callCount: { $sum: 1 },
          connectedCount: {
            $sum: {
              $cond: [
                { $eq: ["$call_analysis.STATUS", "connected"] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.hour",
          totalCalls: { $sum: "$callCount" },
          connectedCalls: { $sum: "$connectedCount" },
          avgCallsPerDay: { $avg: "$callCount" }
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];

    // Run all aggregations in parallel
    const [
      timeSeriesResult,
      facetResultArr,
      costBreakdownResult,
      realtimeCallStatusResult,
      peakTimesResult
    ] = await Promise.all([
      OutBoundCall.aggregate(timeSeriesPipeline),
      OutBoundCall.aggregate(facetPipeline),
      OutBoundCall.aggregate(costBreakdownPipeline),
      OutBoundCall.aggregate(realtimeCallStatusPipeline),
      OutBoundCall.aggregate(peakTimesPipeline)
    ]);
    const facetResult: FacetResult = facetResultArr[0] || {};

    // // Debug: Log aggregation results
    // console.log('Time series aggregation result:', timeSeriesResult);
    // console.log('Facet aggregation result:', facetResult);

    // Format for frontend (cards)
    const toNumber = (v: any) =>
      v && typeof v === "object" && v.$numberDecimal
        ? parseFloat(v.$numberDecimal)
        : typeof v === "number"
        ? v
        : 0;

    // For time series:
    const totalCallMinutes = timeSeriesResult.map(r => ({
      date: r._id,
      value: toNumber(r.totalCallMinutes)
    }));
    const numberOfCalls = timeSeriesResult.map(r => ({
      date: r._id,
      value: toNumber(r.numberOfCalls)
    }));
    const totalSpent = timeSeriesResult.map(r => ({
      date: r._id,
      value: toNumber(r.totalSpent)
    }));
    // Calculate avg cost per call per day
    const avgCostPerCall = timeSeriesResult.map(r => ({
      date: r._id,
      value: toNumber(r.numberOfCalls) > 0 ? toNumber(r.totalSpent) / toNumber(r.numberOfCalls) : 0
    }));

    // Format costBreakdown for frontend
    const costBreakdownByDay = costBreakdownResult.map(r => ({
      date: r._id,
      llm: typeof r.llm === "object" && r.llm.$numberDecimal ? parseFloat(r.llm.$numberDecimal) : r.llm,
      stt: typeof r.stt === "object" && r.stt.$numberDecimal ? parseFloat(r.stt.$numberDecimal) : r.stt,
      tts: typeof r.tts === "object" && r.tts.$numberDecimal ? parseFloat(r.tts.$numberDecimal) : r.tts,
    }));

    // Format real-time call status for frontend
    const realtimeCallStatus = {
      connected: realtimeCallStatusResult.find(r => r._id === "connected")?.count || 0,
      notConnected: realtimeCallStatusResult.find(r => r._id === "notConnected")?.count || 0
    };

    // Format peak times for frontend
    const peakTimes = peakTimesResult.map(r => ({
      hour: r._id,
      totalCalls: r.totalCalls,
      connectedCalls: r.connectedCalls,
      avgCallsPerDay: r.avgCallsPerDay
    }));

    // 1. Total Call Duration by Agent (per day)
    const agentTotalDurationPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user.userId) } },
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
      { $match: matchConditions },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$started_at_date" } },
            agent: "$agent_config.agentName"
          },
          totalDuration: { $sum: { $divide: ["$call_duration_in_sec", 60] } }
        }
      },
      { $sort: { _id: 1 as 1 } }
    ];
    const agentTotalDurationResult = await OutBoundCall.aggregate(agentTotalDurationPipeline);
    const agentTotalDurationByDay = agentTotalDurationResult.map(r => ({
      date: r._id.date,
      agent: r._id.agent || "Unknown",
      totalDuration: typeof r.totalDuration === "object" && r.totalDuration.$numberDecimal
        ? parseFloat(r.totalDuration.$numberDecimal)
        : r.totalDuration
    }));

    const outboundSentiment = facetResult.outboundSentiment || [];
    const inboundSentiment = facetResult.inboundSentiment || [];

    const outboundPositive = outboundSentiment.find(s => s._id === 'positive')?.count || 0;
    const outboundNegative = outboundSentiment.find(s => s._id === 'negative')?.count || 0;
    const outboundNeutral = outboundSentiment.find(s => s._id === 'neutral')?.count || 0;

    const inboundPositive = inboundSentiment.find(s => s._id === 'positive')?.count || 0;
    const inboundNegative = inboundSentiment.find(s => s._id === 'negative')?.count || 0;
    const inboundNeutral = inboundSentiment.find(s => s._id === 'neutral')?.count || 0;

    return NextResponse.json({
      totalCallMinutes: totalCallMinutes.map(r => ({
        date: r.date,
        value: Number(r.value.toFixed(2))
      })),
      numberOfCalls,
      totalSpent: totalSpent.map(r => ({
        date: r.date,
        value: Number(r.value.toFixed(2))
      })),
      costBreakdownByDay: costBreakdownByDay.map(r => ({
        date: r.date,
        llm: Number(r.llm.toFixed(2)),
        stt: Number(r.stt.toFixed(2)),
        tts: Number(r.tts.toFixed(2))
      })),
      agentTotalDurationByDay: agentTotalDurationByDay.map(r => ({
        date: r.date,
        agent: r.agent,
        totalDuration: Number(r.totalDuration.toFixed(2))
      })),
      realtimeCallStatus,
      peakTimes: peakTimes.map(r => ({
        hour: r.hour,
        totalCalls: r.totalCalls,
        connectedCalls: r.connectedCalls,
        avgCallsPerDay: Number(r.avgCallsPerDay.toFixed(2))
      })),
      avgCostPerCall: avgCostPerCall.map(r => ({
        date: r.date,
        value: Number(r.value.toFixed(2))
      })),
      ...facetResult,
      // Process duration metrics with 2 decimal places
      outboundLessThan10sec: facetResult.outboundDuration?.find(d => d._id === 'lessThan10sec')?.count || 0,
      outbound10secTo1min: facetResult.outboundDuration?.find(d => d._id === '10secTo1min')?.count || 0,
      outboundMoreThan1min: facetResult.outboundDuration?.find(d => d._id === 'moreThan1min')?.count || 0,
      
      inboundLessThan10sec: facetResult.inboundDuration?.find(d => d._id === 'lessThan10sec')?.count || 0,
      inbound10secTo1min: facetResult.inboundDuration?.find(d => d._id === '10secTo1min')?.count || 0,
      inboundMoreThan1min: facetResult.inboundDuration?.find(d => d._id === 'moreThan1min')?.count || 0,
      
      // Process disposition metrics
      outboundResolved: facetResult.outboundDisposition?.find(d => d._id === 'resolved')?.count || 0,
      outboundEscalated: facetResult.outboundDisposition?.find(d => d._id === 'escalated')?.count || 0,
      outboundCallBackRequired: facetResult.outboundDisposition?.find(d => d._id === 'callback_required')?.count || 0,
      
      inboundResolved: facetResult.inboundDisposition?.find(d => d._id === 'resolved')?.count || 0,
      inboundEscalated: facetResult.inboundDisposition?.find(d => d._id === 'escalated')?.count || 0,
      inboundCallBackRequired: facetResult.inboundDisposition?.find(d => d._id === 'callback_required')?.count || 0,
      
      // Process AI metrics with 2 decimal places
      outboundNLPErrorRate: Number((facetResult.outboundAIMetrics?.[0]?.avgNlpErrorRate ?? 0).toFixed(2)),
      outboundIntentSuccessRate: Number((facetResult.outboundAIMetrics?.[0]?.avgIntentSuccessRate ?? 0).toFixed(2)),
      outboundResolutionSuccess: Number((facetResult.outboundAIMetrics?.[0]?.avgResolutionSuccess ?? 0).toFixed(2)),
      
      inboundNLPErrorRate: Number((facetResult.inboundAIMetrics?.[0]?.avgNlpErrorRate ?? 0).toFixed(2)),
      inboundIntentSuccessRate: Number((facetResult.inboundAIMetrics?.[0]?.avgIntentSuccessRate ?? 0).toFixed(2)),
      inboundResolutionSuccess: Number((facetResult.inboundAIMetrics?.[0]?.avgResolutionSuccess ?? 0).toFixed(2)),

      unansweredOutboundVoicemail: facetResult.unansweredOutboundVoicemail?.[0]?.count || 0,
      unansweredOutboundBusy: facetResult.unansweredOutboundBusy?.[0]?.count || 0,
      outboundPositive,
      outboundNegative,
      outboundNeutral,
      inboundPositive,
      inboundNegative,
      inboundNeutral
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

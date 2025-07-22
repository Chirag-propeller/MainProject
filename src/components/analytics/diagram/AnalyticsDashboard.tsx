import React, { useEffect, useState } from "react";
import { MetricsCardComp } from "./MetricsCardComp";
import { DetailPanel } from "./DetailPanel";
import { FlowConnector } from "./FlowConnector";
import axios from "axios";

type VariantType = "success" | "warning" | "default" | "info";

const CallAnalyticsDashboard: React.FC<{ filters: any }> = ({ filters }) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/analytics", { data: filters })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  // Calculate metrics from data
  const totalCalls = {
    label: "Total Calls",
    value: data?.totalCalls?.[0]?.count || 0,
    total: data?.totalCalls?.[0]?.count || 0,
    percentage: "(100%)",
  };

  const outboundMetrics = [
    {
      label: "Answered Outbound",
      value: data?.answeredOutbound?.[0]?.count || 0,
      total: data?.outboundCalls?.[0]?.count || 0,
      percentage: data?.outboundCalls?.[0]?.count
        ? `(${Math.round(((data?.answeredOutbound?.[0]?.count || 0) / data?.outboundCalls?.[0]?.count) * 100)}%)`
        : "(0%)",
    },
    {
      label: "Unanswered Outbound",
      value:
        (data?.outboundCalls?.[0]?.count || 0) -
        (data?.answeredOutbound?.[0]?.count || 0),
      total: data?.outboundCalls?.[0]?.count || 0,
      percentage: data?.outboundCalls?.[0]?.count
        ? `(${Math.round((((data?.outboundCalls?.[0]?.count || 0) - (data?.answeredOutbound?.[0]?.count || 0)) / data?.outboundCalls?.[0]?.count) * 100)}%)`
        : "(0%)",
    },
  ];

  const inboundMetrics = [
    {
      label: "Answered Inbound",
      value: data?.answeredInbound?.[0]?.count || 0,
      total: data?.inboundCalls?.[0]?.count || 0,
      percentage: data?.inboundCalls?.[0]?.count
        ? `(${Math.round(((data?.answeredInbound?.[0]?.count || 0) / data?.inboundCalls?.[0]?.count) * 100)}%)`
        : "(0%)",
    },
    {
      label: "Unanswered Inbound",
      value:
        (data?.inboundCalls?.[0]?.count || 0) -
        (data?.answeredInbound?.[0]?.count || 0),
      total: data?.inboundCalls?.[0]?.count || 0,
      percentage: data?.inboundCalls?.[0]?.count
        ? `(${Math.round((((data?.inboundCalls?.[0]?.count || 0) - (data?.answeredInbound?.[0]?.count || 0)) / data?.inboundCalls?.[0]?.count) * 100)}%)`
        : "(0%)",
    },
  ];

  // Helper for detail metrics
  function percent(val: number, total: number) {
    if (!total) return "(0%)";
    return `(${Math.round((val / total) * 100)}%)`;
  }

  // Outbound details
  const outboundDetails = [
    {
      title: "Sentiment",
      metrics: [
        {
          label: "Positive",
          value: data?.outboundPositive || 0,
          percentage: percent(
            data?.outboundPositive || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Negative",
          value: data?.outboundNegative || 0,
          percentage: percent(
            data?.outboundNegative || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Neutral",
          value: data?.outboundNeutral || 0,
          percentage: percent(
            data?.outboundNeutral || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "default" as VariantType,
        },
      ],
    },
    {
      title: "Call Disposition",
      metrics: [
        {
          label: "Resolved",
          value: data?.outboundResolved || 0,
          percentage: percent(
            data?.outboundResolved || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Escalated",
          value: data?.outboundEscalated || 0,
          percentage: percent(
            data?.outboundEscalated || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Call Back Required",
          value: data?.outboundCallBackRequired || 0,
          percentage: percent(
            data?.outboundCallBackRequired || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "info" as VariantType,
        },
      ],
    },
    {
      title: "Call Duration",
      metrics: [
        {
          label: "<10 sec",
          value: data?.outboundLessThan10sec || 0,
          percentage: percent(
            data?.outboundLessThan10sec || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "10 sec - 1 min",
          value: data?.outbound10secTo1min || 0,
          percentage: percent(
            data?.outbound10secTo1min || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "default" as VariantType,
        },
        {
          label: ">1 min",
          value: data?.outboundMoreThan1min || 0,
          percentage: percent(
            data?.outboundMoreThan1min || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
      ],
    },
    {
      title: "AI Interaction",
      metrics: [
        {
          label: "NLP Error Rate",
          value: data?.outboundNLPErrorRate || 0,
          percentage: percent(
            data?.outboundNLPErrorRate || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Intent Success Rate",
          value: data?.outboundIntentSuccessRate || 0,
          percentage: percent(
            data?.outboundIntentSuccessRate || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Resolution Success",
          value: data?.outboundResolutionSuccess || 0,
          percentage: percent(
            data?.outboundResolutionSuccess || 0,
            data?.answeredOutbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
      ],
    },
  ];

  // Inbound details
  const inboundDetails = [
    {
      title: "Sentiment",
      metrics: [
        {
          label: "Positive",
          value: data?.inboundPositive || 0,
          percentage: percent(
            data?.inboundPositive || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Negative",
          value: data?.inboundNegative || 0,
          percentage: percent(
            data?.inboundNegative || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Neutral",
          value: data?.inboundNeutral || 0,
          percentage: percent(
            data?.inboundNeutral || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "default" as VariantType,
        },
      ],
    },
    {
      title: "Call Disposition",
      metrics: [
        {
          label: "Resolved",
          value: data?.inboundResolved || 0,
          percentage: percent(
            data?.inboundResolved || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Escalated",
          value: data?.inboundEscalated || 0,
          percentage: percent(
            data?.inboundEscalated || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Call Back Required",
          value: data?.inboundCallBackRequired || 0,
          percentage: percent(
            data?.inboundCallBackRequired || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "info" as VariantType,
        },
      ],
    },
    {
      title: "Call Duration",
      metrics: [
        {
          label: "<10 sec",
          value: data?.inboundLessThan10sec || 0,
          percentage: percent(
            data?.inboundLessThan10sec || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "10 sec - 1 min",
          value: data?.inbound10secTo1min || 0,
          percentage: percent(
            data?.inbound10secTo1min || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "default" as VariantType,
        },
        {
          label: ">1 min",
          value: data?.inboundMoreThan1min || 0,
          percentage: percent(
            data?.inboundMoreThan1min || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
      ],
    },
    {
      title: "AI Interaction",
      metrics: [
        {
          label: "NLP Error Rate",
          value: data?.inboundNLPErrorRate || 0,
          percentage: percent(
            data?.inboundNLPErrorRate || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "warning" as VariantType,
        },
        {
          label: "Intent Success Rate",
          value: data?.inboundIntentSuccessRate || 0,
          percentage: percent(
            data?.inboundIntentSuccessRate || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
        {
          label: "Resolution Success",
          value: data?.inboundResolutionSuccess || 0,
          percentage: percent(
            data?.inboundResolutionSuccess || 0,
            data?.answeredInbound?.[0]?.count || 0
          ),
          variant: "success" as VariantType,
        },
      ],
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full space-y-8">
        {/* Main Flow Layout */}
        <div className="flex flex-row gap-4 w-full border-gray-400 dark:border-gray-700">
          {/* Left: Total Calls */}
          <div className="flex flex-col justify-start">
            <MetricsCardComp
              metric={totalCalls}
              size="large"
              className="h-full"
            />
          </div>
          {/* Right: Outbound Calls and sub-metrics */}
          <div className="flex flex-col gap-6 flex-1 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Outbound Section */}
              <div className="space-y-3">
                <MetricsCardComp
                  metric={{
                    label: "Outbound Calls",
                    value: data?.outboundCalls?.[0]?.count || 0,
                    total: data?.totalCalls?.[0]?.count || 0,
                    percentage: data?.totalCalls?.[0]?.count
                      ? `(${Math.round(((data?.outboundCalls?.[0]?.count || 0) / data?.totalCalls?.[0]?.count) * 100)}%)`
                      : "(0%)",
                  }}
                  size="medium"
                />
                <MetricsCardComp
                  metric={{
                    label: "Inbound Calls",
                    value: data?.inboundCalls?.[0]?.count || 0,
                    total: data?.totalCalls?.[0]?.count || 0,
                    percentage: data?.totalCalls?.[0]?.count
                      ? `(${Math.round(((data?.inboundCalls?.[0]?.count || 0) / data?.totalCalls?.[0]?.count) * 100)}%)`
                      : "(0%)",
                  }}
                  size="medium"
                />
              </div>

              {/* Inbound Section */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {outboundMetrics.map((metric, index) => (
                    <MetricsCardComp
                      key={index}
                      metric={metric}
                      size="medium"
                    />
                  ))}
                </div>

                {/* Inbound Sub-metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inboundMetrics.map((metric, index) => (
                    <MetricsCardComp
                      key={index}
                      metric={metric}
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level 2: Outbound/Inbound Summary */}

        {/* Level 3: Outbound Analytics Cards in Horizontal Line */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-indigo-500 dark:text-indigo-300 text-center">
            Outbound Analytics
          </h3>
          <h5 className="text-xs italic text-gray-500 dark:text-indigo-300/70 text-center -mt-2">
            (Call Distribution of Answered Outbound Calls)
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full border-gray-400 dark:border-gray-700">
            {outboundDetails.map((section, index) => (
              <DetailPanel key={index} section={section} />
            ))}
          </div>
        </div>

        {/* Level 4: Inbound Analytics Cards in Horizontal Line */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-indigo-500 dark:text-indigo-300 text-center">
            Inbound Analytics
          </h3>
          <h5 className="text-xs italic text-gray-500 dark:text-indigo-300/70 text-center -mt-2">
            (Call Distribution of Answered Inbound Calls)
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full border-gray-400 dark:border-gray-700">
            {inboundDetails.map((section, index) => (
              <DetailPanel key={index} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallAnalyticsDashboard;

// components/Diagram/DiagramCanvas.tsx
"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, { Node, Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { Position } from "reactflow";
import axios from "axios";
import { SmallNode } from "./SmallNode";
import { HorizontalTableNode } from "./TableNode";
import { HorizontalTableNode2 } from "./TableNode2";
import { OutBoundTable } from "./OutBoundTable";
import ThirdLevelCell from "./ThirdLevelCell";
import FirstLevelLeg from "./FirstLevelLeg";
import SecondLevelLeg from "./SecondLevelLeg";
import Sentiment from "./Sentiment";

const DiagramCanvas: React.FC<{ filters: any }> = ({ filters }) => {
  const nodeTypes = {
    horizontalTableNode: HorizontalTableNode,
    horizontalTableNode2: HorizontalTableNode2,
    smallNode: SmallNode,
    OutBoundTable: OutBoundTable,
    thirdLevelCell: ThirdLevelCell,
    firstLevelLeg: FirstLevelLeg,
    sentiment: Sentiment,
    secondLevelLeg: SecondLevelLeg,
  };

  const [data, setData] = useState<any>({
    totalCalls: 0,
    outboundCalls: 0,
    inboundCalls: 0,
    answeredOutbound: 0,
    unansweredOutbound: 0,
    answeredInbound: 0,
    inboundPositive: 0,
    inboundNegative: 0,
    inboundNeutral: 0,
    outboundPositive: 0,
    outboundNegative: 0,
    outboundNeutral: 0,

    outboundResolved: 0,
    outboundEscalated: 0,
    outboundCallBackRequired: 0,

    outboundLessThan10sec: 0,
    outbound10secTo1min: 0,
    outboundMoreThan1min: 0,

    outboundNLPErrorRate: 0,
    outboundIntentSuccessRate: 0,
    outboundResolutionSuccess: 0,

    unansweredOutboundVoicemail: 0,
    unansweredOutboundBusy: 0,

    inboundResolved: 0,
    inboundEscalated: 0,
    inboundCallBackRequired: 0,

    inboundLessThan10sec: 0,
    inbound10secTo1min: 0,
    inboundMoreThan1min: 0,

    inboundNLPErrorRate: 0,
    inboundIntentSuccessRate: 0,
    inboundResolutionSuccess: 0,
  });

  const constant = {
    fourthLevelFirst: {
      initialY: 90,
      gap: 70,
    },

    fourthLevelSecond: {
      initialY: 370,
      gap: 70,
    },

    fourthLevelInitialY: 400,
    fourthLevelgap: 70,
  };

  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("filters", filters);
      const result = await axios.post("/api/analytics", { data: filters });
      // console.log(result.data);
      setResponse(result.data);

      const apiData = result.data;
      const outboundSentiment = apiData.outboundSentiment;
      const inboundSentiment = apiData.inboundSentiment;

      let outboundNeutral = 0;
      let outboundNegative = 0;
      let outboundPositive = 0;
      let inboundNeutral = 0;
      let inboundNegative = 0;
      let inboundPositive = 0;

      outboundSentiment.forEach((item: any) => {
        if (item._id === "neutral") {
          outboundNeutral = item.count;
        } else if (item._id === "negative") {
          outboundNegative = item.count;
        } else if (item._id === "positive") {
          outboundPositive = item.count;
        }
      });

      inboundSentiment.forEach((item: any) => {
        if (item._id === "neutral") {
          inboundNeutral = item.count;
        } else if (item._id === "negative") {
          inboundNegative = item.count;
        } else if (item._id === "positive") {
          inboundPositive = item.count;
        }
      });

      setData({
        totalCalls: apiData.totalCalls?.[0]?.count || 0,
        outboundCalls: apiData.outboundCalls?.[0]?.count || 0,
        inboundCalls: apiData.inboundCalls?.[0]?.count || 0,
        answeredOutbound: apiData.answeredOutbound?.[0]?.count || 0,
        answeredInbound: apiData.answeredInbound?.[0]?.count || 0,
        unansweredOutbound:
          (apiData.outboundCalls?.[0]?.count || 0) -
          (apiData.answeredOutbound?.[0]?.count || 0),

        outboundPositive,
        outboundNegative,
        outboundNeutral,
        inboundPositive,
        inboundNegative,
        inboundNeutral,

        // NEW: add defaults here
        outboundResolved: apiData.outboundResolved || 0,
        outboundEscalated: apiData.outboundEscalated || 0,
        outboundCallBackRequired: apiData.outboundCallBackRequired || 0,

        outboundLessThan10sec: apiData.outboundLessThan10sec || 0,
        outbound10secTo1min: apiData.outbound10secTo1min || 0,
        outboundMoreThan1min: apiData.outboundMoreThan1min || 0,

        outboundNLPErrorRate: apiData.outboundNLPErrorRate || 0,
        outboundIntentSuccessRate: apiData.outboundIntentSuccessRate || 0,
        outboundResolutionSuccess: apiData.outboundResolutionSuccess || 0,

        unansweredOutboundVoicemail: apiData.unansweredOutboundVoicemail || 0,
        unansweredOutboundBusy: apiData.unansweredOutboundBusy || 0,

        inboundResolved: apiData.inboundResolved || 0,
        inboundEscalated: apiData.inboundEscalated || 0,
        inboundCallBackRequired: apiData.inboundCallBackRequired || 0,

        inboundLessThan10sec: apiData.inboundLessThan10sec || 0,
        inbound10secTo1min: apiData.inbound10secTo1min || 0,
        inboundMoreThan1min: apiData.inboundMoreThan1min || 0,

        inboundNLPErrorRate: apiData.inboundNLPErrorRate || 0,
        inboundIntentSuccessRate: apiData.inboundIntentSuccessRate || 0,
        inboundResolutionSuccess: apiData.inboundResolutionSuccess || 0,
      });
    };
    fetchData();
  }, [filters]);

  const nodes: Node[] = [
    {
      id: "total",
      type: "firstLevelLeg",
      data: { label: `Total Calls`, value: data?.totalCalls },
      position: { x: -400, y: 100 },
      sourcePosition: Position.Right,
    },
    {
      id: "outbound",
      type: "secondLevelLeg",
      data: {
        label: `Outbound Calls `,
        value: data?.outboundCalls,
        preValue: data?.totalCalls,
        borderColor: "border-l-indigo-400",
        textColor: "text-indigo-500",
      },
      position: { x: 120, y: 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "inbound",
      type: "secondLevelLeg",
      data: {
        label: `Inbound Calls `,
        value: data?.inboundCalls,
        preValue: data?.totalCalls,
        borderColor: "border-l-indigo-800",
        textColor: "text-indigo-800",
      },
      position: { x: 120, y: 382 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    {
      id: "answeredOutbound",
      type: "thirdLevelCell",
      data: {
        label: `Answered Outbound \n`,
        value: data?.answeredOutbound,
        preValue: data?.outboundCalls,
        borderColor: "border-l-indigo-400",
        textColor: "text-indigo-500",
      },
      position: { x: 500, y: 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "unansweredOutbound",
      type: "OutBoundTable",
      data: {
        label: `Unanswered Outbound\n `,
        preValue: data?.outboundCalls,
        tableHeading: ["Voice mail", "Busy"],
        tableValues: [
          data?.unansweredOutboundVoicemail,
          data?.unansweredOutboundBusy,
        ],
        borderColor: "border-l-indigo-400",
        textColor: "text-indigo-500",
      },
      position: { x: 500, y: 237 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    {
      id: "answeredInbound",
      type: "thirdLevelCell",
      data: {
        label: `Answered Inbound \n `,
        value: data?.answeredInbound,
        preValue: data?.inboundCalls,
        borderColor: "border-l-indigo-800",
        textColor: "text-indigo-800",
      },
      position: { x: 500, y: 451 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    // Table Node
    {
      id: "sentimentOutbound",
      type: "horizontalTableNode",
      data: {
        label: "Sentiment",
        borderColor: "indigo-400",
        textColor: "text-indigo-500",
        tableHeading: ["Positive", "Negative", "Neutral"],
        tableValues: [
          data?.outboundPositive,
          data?.outboundNegative,
          data?.outboundNeutral,
        ],
        preValue: data?.answeredOutbound,
        formatDecimals: true,
      },
      position: { x: 925, y: constant.fourthLevelFirst.initialY },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    {
      id: "dispositionOutbound",
      type: "horizontalTableNode",
      data: {
        label: "Call Disposition",
        borderColor: "indigo-400",
        textColor: "text-indigo-500",
        tableHeading: ["Resolved", "Escalated", "Call Back Required"],
        tableValues: [
          data?.outboundResolved,
          data?.outboundEscalated,
          data?.outboundCallBackRequired,
        ],
      },
      position: {
        x: 925,
        y: constant.fourthLevelFirst.initialY + constant.fourthLevelgap,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    {
      id: "durationOutbound",
      type: "horizontalTableNode",
      data: {
        label: "Call Duration",
        borderColor: "indigo-400",
        textColor: "text-indigo-500",
        tableHeading: ["<10 sec", "10 sec - 1 min", ">1 min"],
        tableValues: [
          data?.outboundLessThan10sec,
          data?.outbound10secTo1min,
          data?.outboundMoreThan1min,
        ],
        preValue: data?.answeredOutbound,
        formatDecimals: true,
        showPercentage: true,
      },
      position: {
        x: 925,
        y: constant.fourthLevelFirst.initialY + constant.fourthLevelgap * 2,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "aiOutbound",
      type: "horizontalTableNode2",
      data: {
        label: "AI Interaction",
        borderColor: "indigo-400",
        textColor: "text-indigo-500",
        tableHeading: [
          "NLP Error Rate",
          "Intent Success Rate",
          "Resolution Success",
        ],
        tableValues: [
          data?.outboundNLPErrorRate,
          data?.outboundIntentSuccessRate,
          data?.outboundResolutionSuccess,
        ],
        formatDecimals: true,
        showPercentage: false,
      },
      position: {
        x: 925,
        y: constant.fourthLevelFirst.initialY + constant.fourthLevelgap * 3,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },

    // unanswered children
    {
      id: "sentimentInbound",
      type: "horizontalTableNode",
      data: {
        label: "Sentiment",
        borderColor: "indigo-800",
        textColor: "text-indigo-800",
        tableHeading: ["Positive", "Negative", "Neutral"],
        tableValues: [
          data?.inboundPositive,
          data?.inboundNegative,
          data?.inboundNeutral,
        ],
      },
      position: { x: 925, y: constant.fourthLevelSecond.initialY },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "dispositionInbound",
      type: "horizontalTableNode",
      data: {
        label: "Call Disposition",
        borderColor: "indigo-800",
        textColor: "text-indigo-800",
        tableHeading: ["Resolved", "Escalated", "Call Back Required"],
        tableValues: [
          data?.inboundResolved,
          data?.inboundEscalated,
          data?.inboundCallBackRequired,
        ],
      },
      position: {
        x: 925,
        y: constant.fourthLevelSecond.initialY + constant.fourthLevelgap,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "durationInbound",
      type: "horizontalTableNode",
      data: {
        label: "Call Duration",
        borderColor: "indigo-800",
        textColor: "text-indigo-800",
        tableHeading: ["<10 sec", "10 sec - 1 min", ">1 min"],
        tableValues: [
          data?.inboundLessThan10sec,
          data?.inbound10secTo1min,
          data?.inboundMoreThan1min,
        ],
        preValue: data?.answeredInbound,
        formatDecimals: true,
        showPercentage: true,
      },
      position: {
        x: 925,
        y: constant.fourthLevelSecond.initialY + constant.fourthLevelgap * 2,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    {
      id: "aiInbound",
      type: "horizontalTableNode2",
      data: {
        label: "AI Interaction",
        borderColor: "indigo-800",
        textColor: "text-indigo-800",
        tableHeading: [
          "NLP Error Rate",
          "Intent Success Rate",
          "Resolution Success",
        ],
        tableValues: [
          data?.inboundNLPErrorRate,
          data?.inboundIntentSuccessRate,
          data?.inboundResolutionSuccess,
        ],
        formatDecimals: true,
      },
      position: {
        x: 925,
        y: constant.fourthLevelSecond.initialY + constant.fourthLevelgap * 3,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
  ];
  const edges: Edge[] = [
    {
      id: "e1",
      source: "total",
      target: "outbound",
      type: "step",
      style: {
        stroke: "#ff0000",
        strokeDasharray: "5 5",
      },
    },
    {
      id: "e2",
      source: "total",
      target: "inbound",
      type: "step",
      style: { color: "blue" },
    },

    {
      id: "e3",
      source: "outbound",
      target: "answeredOutbound",
      type: "step",
      style: { stroke: "blue", strokeDasharray: "5 5" },
    },
    {
      id: "e4",
      source: "outbound",
      target: "unansweredOutbound",
      type: "step",
    },
    { id: "e5", source: "inbound", target: "answeredInbound", type: "step" },
    { id: "e6", source: "inbound", target: "unansweredInbound", type: "step" },

    {
      id: "e7",
      source: "answeredOutbound",
      target: "sentimentOutbound",
      type: "step",
    },
    {
      id: "e8",
      source: "answeredOutbound",
      target: "dispositionOutbound",
      type: "step",
    },
    {
      id: "e9",
      source: "answeredOutbound",
      target: "durationOutbound",
      type: "step",
    },
    {
      id: "e10",
      source: "answeredOutbound",
      target: "aiOutbound",
      type: "step",
    },

    {
      id: "e11",
      source: "unansweredOutbound",
      target: "voicemail",
      type: "step",
    },
    { id: "e12", source: "unansweredOutbound", target: "busy", type: "step" },

    {
      id: "e13",
      source: "answeredInbound",
      target: "sentimentInbound",
      type: "step",
    },
    {
      id: "e14",
      source: "answeredInbound",
      target: "dispositionInbound",
      type: "step",
    },
    {
      id: "e15",
      source: "answeredInbound",
      target: "durationInbound",
      type: "step",
    },
    { id: "e16", source: "answeredInbound", target: "aiInbound", type: "step" },

    { id: "e17", source: "sentimentOutbound", target: "positive" },
    { id: "e18", source: "sentimentOutbound", target: "negative" },
    { id: "e19", source: "sentimentOutbound", target: "neutral" },

    { id: "e20", source: "dispositionOutbound", target: "resolved" },
    { id: "e21", source: "dispositionOutbound", target: "escalated" },
    { id: "e22", source: "dispositionOutbound", target: "callBackRequired" },

    { id: "e23", source: "durationOutbound", target: "lessThan10sec" },
    { id: "e24", source: "durationOutbound", target: "10secTo1min" },
    { id: "e25", source: "durationOutbound", target: "moreThan1min" },

    { id: "e26", source: "aiOutbound", target: "NLPErrorRate" },
    { id: "e27", source: "aiOutbound", target: "intentSuccessRate" },
    { id: "e28", source: "aiOutbound", target: "resolutionSuccess" },

    { id: "e31", source: "sentimentInbound", target: "positiveInbound" },
    { id: "e32", source: "sentimentInbound", target: "negativeInbound" },
    { id: "e33", source: "sentimentInbound", target: "neutralInbound" },

    { id: "e34", source: "dispositionInbound", target: "resolvedInbound" },
    { id: "e35", source: "dispositionInbound", target: "escalatedInbound" },
    {
      id: "e36",
      source: "dispositionInbound",
      target: "callBackRequiredInbound",
    },

    { id: "e37", source: "durationInbound", target: "lessThan10secInbound" },
    { id: "e38", source: "durationInbound", target: "10secTo1minInbound" },
    { id: "e39", source: "durationInbound", target: "moreThan1minInbound" },

    { id: "e40", source: "aiInbound", target: "NLPErrorRateInbound" },
    { id: "e41", source: "aiInbound", target: "intentSuccessRateInbound" },
    { id: "e42", source: "aiInbound", target: "resolutionSuccessInbound" },
  ];

  const displayedNodes = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      //   opacity: isConnected(node.id, selectedNodeId!, edges) ? 1 : 0.2
    },
  }));

  const displayedEdges = edges.map((edge) => ({
    ...edge,
    markerEnd: {
      type: MarkerType.ArrowClosed, // Options: 'arrow' or 'arrowclosed' // Match this with your edge color
      width: 20,
      height: 20,
    },
    style: {
      // stroke: isConnected(edge.source, selectedNodeId!, edges) ? '#000' : '#999',
      //   opacity: isConnected(edge.source, selectedNodeId!, edges) ? 1 : 0.2
    },
  }));

  return (
    <div className="min-w-50vw" style={{ height: "60vh", minHeight: 400 }}>
      <ReactFlow
        className="!cursor-pointer dark:bg-gray-900 dark:text-gray-100"
        nodeTypes={nodeTypes}
        nodes={displayedNodes}
        edges={displayedEdges}
        // onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        preventScrolling={false} // Allow page scrolling
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView={true}
        defaultViewport={{ x: 25, y: -70, zoom: 0.8 }}
      >
        {/* <Controls /> */}
        {/* <Background /> */}
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;

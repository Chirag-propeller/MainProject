// components/Diagram/staticData.ts

export const mockData = {
    totalCalls: 1000,
    outbound: 600,
    inbound: 400,
    answeredOutbound: 500,
    unansweredOutbound: 100,
    answeredInbound: 380,
    unansweredInbound: 20,
    sentiment: {
      outbound: { positive: 200, neutral: 150, negative: 150 },
      inbound: { positive: 180, neutral: 100, negative: 100 }
    },
    disposition: {
      outbound: { resolved: 300, escalated: 120, callback: 80 },
      inbound: { resolved: 250, escalated: 80, callback: 50 }
    },
    duration: {
      outbound: { '<10sec': 50, '10sec-1min': 300, '>1min': 150 },
      inbound: { '<10sec': 40, '10sec-1min': 250, '>1min': 90 }
    },
    ai: {
      outbound: { NLPErrorRate: 0.1, intentSuccessRate: 0.8, resolutionSuccess: 0.7 },
      inbound: { NLPErrorRate: 0.05, intentSuccessRate: 0.85, resolutionSuccess: 0.75 }
    }
  };
  
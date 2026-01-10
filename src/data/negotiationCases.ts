export interface NegotiationCase {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  systemPrompt?: string;
  firstMessage?: string;
  assistantId: string; // Vapi hosted assistant ID
  scenario: {
    location: string;
    time: string;
    conditions: string;
    yourRole: string;
    aiRole: string;
    objective: string;
  };
}

export const negotiationCases: NegotiationCase[] = [
  {
    id: "ski-pass",
    title: "Ski Pass Negotiation",
    description: "Negotiate the purchase of a full-day ski pass from another skier at an Austrian resort",
    difficulty: "Beginner",
    duration: "5-10 min",
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID_SKIPASS ?? "0f4de0f8-b0d6-4fbf-82ab-0a15fe7f3f9f",
    scenario: {
      location: "Austrian ski resort valley station",
      time: "12:50 PM, Thursday in January",
      conditions: "Perfect skiing weather, fresh snow",
      yourRole: "You want to buy a ski pass for the afternoon",
      aiRole: "Skier selling their full-day pass (originally €40)",
      objective: "Negotiate the best price. Half-day passes cost €30 at the ticket office.",
    },
  },
  {
    id: "gatekeeper-rollenspiel",
    title: "Gatekeeper - Rollenspiel",
    description: "Navigate past a protective executive assistant to reach a key decision-maker",
    difficulty: "Intermediate",
    duration: "7-12 min",
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID_GATEKEEPER ?? "eed3866d-fbe9-49eb-a52a-3ff9cf579389",
    scenario: {
      location: "Phone call to executive office",
      time: "Tuesday, 10:30 AM",
      conditions: "Professional business environment",
      yourRole: "Sales representative / Business development professional",
      aiRole: "Marion Weber - Executive Assistant protecting CEO's time",
      objective: "Get past the gatekeeper and secure a meeting with the CEO.",
    },
  },
];

export const getCaseById = (id: string): NegotiationCase | undefined => {
  return negotiationCases.find((c) => c.id === id);
};

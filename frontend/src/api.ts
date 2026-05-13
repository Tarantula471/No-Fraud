// src/api.ts

export const BASE_URL = "http://127.0.0.1:8000";

export interface AlternativeAction {
  action: string;
  expected_profit: number;
}

export interface RiskResponse {
  order_id: string;

  risk: {
    score: number;
    level: "SAFE" | "MEDIUM" | "HIGH";
    probability_of_rto: number;
    reasons: string[];
  };

  decision: {
    recommended_action: string;
    confidence: string;
    alternatives: AlternativeAction[];
  };

  business_impact: {
    expected_profit: number;
    risk_cost: number;
    notes: string;
  };

  ai_reasoning: {
    summary: string;

    factors: string[];

    confidence_explanation: string;
  };
}

export async function fetchRisk(orderId: string): Promise<RiskResponse> {
  const response = await fetch(
    `${BASE_URL}/risk/score-order?order_id=${orderId}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk analysis");
  }

  return response.json();
}

export async function analyzeOrder(orderId: string): Promise<RiskResponse> {
  const response = await fetch(
    `${BASE_URL}/risk/score-order?order_id=${orderId}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to analyze order");
  }

  return response.json();
}

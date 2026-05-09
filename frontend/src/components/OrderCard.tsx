// src/components/OrderCard.tsx

import ProfitBar from "./ProfitBar";
import { RiskResponse } from "../api";

interface Props {
  data: RiskResponse;
}

function getRiskColor(level: string): string {
  switch (level) {
    case "HIGH":
      return "red";

    case "MEDIUM":
      return "orange";

    default:
      return "green";
  }
}

export default function OrderCard({ data }: Props) {
  const bestAction = data.decision.recommended_action;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h2>Order: {data.order_id}</h2>

      {/* Risk Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Risk Analysis</h3>

        <div>
          <strong>Risk Score:</strong>

          <span
            style={{
              color: getRiskColor(data.risk.level),
              marginLeft: "8px",
              fontWeight: "bold",
            }}
          >
            {data.risk.score} ({data.risk.level})
          </span>
        </div>

        <div style={{ marginTop: "8px" }}>
          <strong>Probability of RTO:</strong>{" "}
          {Math.round(data.risk.probability_of_rto * 100)}%
        </div>

        <div style={{ marginTop: "12px" }}>
          <strong>Reasons:</strong>

          <ul>
            {data.risk.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decision Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Decision Engine</h3>

        <div>
          <strong>Recommended Action:</strong>{" "}
          {data.decision.recommended_action}
        </div>

        <div style={{ marginTop: "8px" }}>
          <strong>Confidence:</strong> {data.decision.confidence}
        </div>
      </div>

      {/* Business Impact */}
      <div style={{ marginBottom: "24px" }}>
        <h3>Business Impact</h3>

        <div>
          <strong>Expected Profit:</strong> ₹
          {data.business_impact.expected_profit}
        </div>

        <div style={{ marginTop: "8px" }}>
          <strong>Risk Cost:</strong> ₹{data.business_impact.risk_cost}
        </div>

        <p style={{ marginTop: "8px", color: "#666" }}>
          {data.business_impact.notes}
        </p>
      </div>

      {/* Alternatives */}
      <div>
        <h3>Action Comparison</h3>

        {data.decision.alternatives.map((alternative, index) => (
          <ProfitBar
            key={index}
            action={alternative.action}
            profit={alternative.expected_profit}
            isBest={alternative.action === bestAction}
          />
        ))}
      </div>
    </div>
  );
}

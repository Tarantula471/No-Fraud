import { useState } from "react";

interface Operator {
  id: number;

  name: string;

  specialization: "FRAUD" | "VIP" | "LOGISTICS";

  activeCases: number;

  maxCapacity: number;

  online: boolean;
}

interface QueueItem {
  order_id: string;

  customer_name: string;

  vip: boolean;

  potential_loss: number;

  created_at: string;

  assignedOperator?: Operator;

  risk: {
    score: number;
    level: string;
    probability_of_rto: number;
  };

  decision: {
    recommended_action: string;
  };

  business_impact: {
    expected_profit: number;
  };
}

const OPERATORS: Operator[] = [
  {
    id: 1,
    name: "Rahul",
    specialization: "FRAUD",
    activeCases: 3,
    maxCapacity: 10,
    online: true,
  },

  {
    id: 2,
    name: "Priya",
    specialization: "VIP",
    activeCases: 2,
    maxCapacity: 8,
    online: true,
  },

  {
    id: 3,
    name: "Arjun",
    specialization: "LOGISTICS",
    activeCases: 5,
    maxCapacity: 12,
    online: true,
  },
];

const MOCK_QUEUE: QueueItem[] = [
  {
    order_id: "A1023",

    customer_name: "Rahul Sharma",

    vip: true,

    potential_loss: 1200,

    created_at: "2 min ago",

    risk: {
      score: 91,
      level: "HIGH",
      probability_of_rto: 0.8,
    },

    decision: {
      recommended_action: "VERIFY",
    },

    business_impact: {
      expected_profit: 908,
    },
  },

  {
    order_id: "A1024",

    customer_name: "Paul",

    vip: false,

    potential_loss: 0,

    created_at: "5 min ago",

    risk: {
      score: 88,
      level: "HIGH",
      probability_of_rto: 0.7,
    },

    decision: {
      recommended_action: "BLOCK",
    },

    business_impact: {
      expected_profit: 120,
    },
  },

  {
    order_id: "A1025",

    customer_name: "Xavier",

    vip: true,

    potential_loss: 500,

    created_at: "1 sec ago",

    risk: {
      score: 76,
      level: "MEDIUM",
      probability_of_rto: 0.6,
    },

    decision: {
      recommended_action: "CONVERT_TO_PREPAID",
    },

    business_impact: {
      expected_profit: 540,
    },
  },
];

function calculatePriority(item: QueueItem) {
  const vipBonus = item.vip ? 20 : 0;

  return Math.round(
    item.risk.score * 0.4 +
      item.risk.probability_of_rto * 100 * 0.3 +
      item.potential_loss * 0.02 +
      vipBonus,
  );
}

function autoAssignOperator(item: QueueItem): Operator | undefined {
  const availableOperators = OPERATORS.filter(
    (op) => op.online && op.activeCases < op.maxCapacity,
  );

  // VIP routing
  if (item.vip) {
    return availableOperators.find((op) => op.specialization === "VIP");
  }

  // High-risk fraud routing
  if (item.risk.score >= 85) {
    return availableOperators.find((op) => op.specialization === "FRAUD");
  }

  // Logistics / COD routing
  return availableOperators.find((op) => op.specialization === "LOGISTICS");
}

export default function OperatorQueue() {
  const initialQueue = MOCK_QUEUE.map((item) => ({
    ...item,
    assignedOperator: autoAssignOperator(item),
  }));

  const [queue, setQueue] = useState<QueueItem[]>(
    initialQueue.sort((a, b) => calculatePriority(b) - calculatePriority(a)),
  );

  function resolveOrder(orderId: string) {
    setQueue((prev) => prev.filter((item) => item.order_id !== orderId));
  }

  function getPriorityColor(score: number) {
    if (score >= 85) return "text-red-400 bg-red-500/10";

    if (score >= 65) return "text-yellow-400 bg-yellow-500/10";

    return "text-green-400 bg-green-500/10";
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Operator Queue</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Orders requiring human review
          </p>
        </div>

        <div className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
          {queue.length} Pending
        </div>
      </div>

      <div className="mb-5 flex gap-3">
        <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
          All
        </button>

        <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400">
          High Priority
        </button>

        <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400">
          VIP
        </button>
      </div>

      {/* Queue */}
      <div className="space-y-4">
        {queue.map((item) => (
          <div
            key={item.order_id}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                  <span className="text-sm text-zinc-500">
                    Auto-routing enabled
                  </span>
                </div>

                <div className="text-lg font-semibold">{item.order_id}</div>

                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.risk.level === "HIGH"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {item.risk.level}
                  </span>

                  <span className="text-sm text-zinc-500">
                    Risk Score: {item.risk.score}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                      calculatePriority(item),
                    )}`}
                  >
                    Priority: {calculatePriority(item)}
                  </div>

                  {item.vip && (
                    <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                      VIP
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-zinc-500">Expected Profit</div>

                <div className="mt-1 text-xl font-bold text-green-400">
                  ₹{item.business_impact.expected_profit}
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  SLA: 04:12 remaining
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="mt-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
              <div className="text-xs uppercase tracking-wide text-blue-400">
                AI Recommendation
              </div>

              <div className="mt-2 text-lg font-semibold text-white">
                {item.decision.recommended_action}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-zinc-500">
                  Assigned Operator
                </div>

                <div className="mt-2 font-semibold">
                  {item.assignedOperator?.name}
                </div>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-400"
                  style={{
                    width: `${
                      (item.assignedOperator!.activeCases /
                        item.assignedOperator!.maxCapacity) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="text-right">
                <div className="text-xs text-zinc-500">Expertise</div>

                <div className="mt-2 text-sm text-blue-400">
                  {item.assignedOperator?.specialization}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => resolveOrder(item.order_id)}
                className="rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                Approve
              </button>

              <button
                onClick={() => resolveOrder(item.order_id)}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Reject
              </button>

              <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.05]">
                Escalate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

interface QueueItem {
  order_id: string;

  risk: {
    score: number;
    level: string;
  };

  decision: {
    recommended_action: string;
  };

  business_impact: {
    expected_profit: number;
  };
}

const MOCK_QUEUE: QueueItem[] = [
  {
    order_id: "A1023",

    risk: {
      score: 91,
      level: "HIGH",
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

    risk: {
      score: 88,
      level: "HIGH",
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

    risk: {
      score: 76,
      level: "MEDIUM",
    },

    decision: {
      recommended_action: "CONVERT_TO_PREPAID",
    },

    business_impact: {
      expected_profit: 540,
    },
  },
];

export default function OperatorQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE);

  function resolveOrder(orderId: string) {
    setQueue((prev) => prev.filter((item) => item.order_id !== orderId));
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
              </div>

              <div className="text-right">
                <div className="text-sm text-zinc-500">Expected Profit</div>

                <div className="mt-1 text-xl font-bold text-green-400">
                  ₹{item.business_impact.expected_profit}
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

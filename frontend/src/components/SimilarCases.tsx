interface Case {
  similarity: number;

  case: {
    order_id: string;

    final_outcome: string;

    actual_profit: number;

    risk_score: number;
  };
}

interface Props {
  cases: Case[];
}

export default function SimilarCases({ cases }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Similar Historical Cases</h3>

        <p className="mt-1 text-sm text-zinc-500">
          AI retrieved comparable incidents
        </p>
      </div>

      {/* Cases */}
      <div className="space-y-4">
        {cases.map((item) => (
          <div
            key={item.case.order_id}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{item.case.order_id}</div>

                <div className="mt-2 text-sm text-zinc-500">
                  Outcome: {item.case.final_outcome}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-blue-400">
                  {item.similarity}% match
                </div>

                <div className="mt-2 text-sm text-green-400">
                  ₹{item.case.actual_profit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

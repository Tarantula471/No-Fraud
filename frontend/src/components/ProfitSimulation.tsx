interface Action {
  action: string;
  expected_profit: number;
}

interface Props {
  actions: Action[];
}

export default function ProfitSimulation({ actions }: Props) {
  const maxProfit = Math.max(...actions.map((a) => a.expected_profit));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Profit Simulation Engine</h3>

        <p className="mt-1 text-sm text-zinc-500">
          AI simulated business outcomes
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-5">
        {actions.map((item) => (
          <div key={item.action}>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium">{item.action}</div>

              <div className="text-sm font-semibold text-green-400">
                ₹{item.expected_profit}
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${(item.expected_profit / maxProfit) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

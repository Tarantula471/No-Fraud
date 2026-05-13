interface Props {
  reasoning: {
    summary: string;

    factors: string[];

    confidence_explanation: string;
  };
}

export default function AIReasoningPanel({ reasoning }: Props) {
  return (
    <div className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">AI Reasoning</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Explainable decision intelligence
          </p>
        </div>

        <div className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
          AI Analysis
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-xs uppercase tracking-wide text-zinc-500">
          Summary
        </div>

        <div className="mt-3 text-lg font-medium leading-8 text-white">
          {reasoning.summary}
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6">
        <div className="mb-4 text-sm font-medium text-zinc-400">
          Key Decision Factors
        </div>

        <div className="space-y-3">
          {reasoning.factors.map((factor, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />

              <div className="text-sm leading-7 text-zinc-300">{factor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <div className="mt-6 rounded-2xl border border-green-500/10 bg-green-500/[0.03] p-5">
        <div className="text-xs uppercase tracking-wide text-green-400">
          Confidence Explanation
        </div>

        <div className="mt-3 text-sm leading-7 text-zinc-300">
          {reasoning.confidence_explanation}
        </div>
      </div>
    </div>
  );
}

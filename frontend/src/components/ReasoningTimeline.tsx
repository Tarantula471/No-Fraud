import { useEffect, useState } from "react";

const STEPS = [
  "Evaluating operational risk signals...",
  "Checking historical delivery failures...",
  "Analyzing pincode reliability patterns...",
  "Estimating expected profitability...",
  "Calculating RTO probability...",
  "Comparing against historical outcomes...",
  "Generating optimized operational strategy...",
];

export default function ReasoningTimeline() {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= STEPS.length) {
          clearInterval(interval);
          return prev;
        }

        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">AI Decision Trace</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Structured reasoning workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

          <span className="text-sm text-zinc-500">Processing</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-5">
        {STEPS.slice(0, visibleSteps).map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-medium text-blue-400">
                {index + 1}
              </div>

              {index !== visibleSteps - 1 && (
                <div className="mt-2 h-10 w-px bg-white/10" />
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">

              <div className="mb-3 flex items-center justify-between">

                <div className="text-sm text-zinc-400">
                  Decision Confidence
                </div>

                <div className="text-sm font-medium text-green-400">
                  92%
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-green-400"
                  style={{ width: "92%" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-300">{step}</div>

                <div className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                  Complete
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { analyzeOrder, type RiskResponse } from "./api";
import LiveOrders from "./components/LiveOrders";
import RealtimeMetrics from "./components/RealtimeMetrics";
import OperatorQueue from "./components/OperatorQueue";
import AnomalyAlerts from "./components/AnomalyAlerts";
import AIReasoningPanel from "./components/AIReasoningPanel";
import ReasoningTimeline from "./components/ReasoningTimeline";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getRiskStyles(level: string) {
  switch (level) {
    case "HIGH":
      return {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
      };

    case "MEDIUM":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
      };

    default:
      return {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/20",
      };
  }
}

export default function App() {
  const [orderId, setOrderId] = useState(
    "93aa8f5b-25ea-4197-8e87-7af8997ffce7",
  );
  const [data, setData] = useState<RiskResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const riskStyles = useMemo(() => {
    if (!data) {
      return getRiskStyles("SAFE");
    }

    return getRiskStyles(data.risk.level);
  }, [data]);

  async function handleAnalyze() {
    if (!orderId) return;

    try {
      setLoading(true);
      setError("");

      const result = await analyzeOrder(orderId);

      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analysis");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Top Navbar */}
      <div className="border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              AI Profit Operator
            </h1>

            <p className="text-sm text-zinc-500">
              Profit-aware order intelligence system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400">
              v1 Decision Engine
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Order Risk Intelligence
            </h2>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Analyze profitability, RTO probability, and operational risk
              before shipping.
            </p>
          </div>

          {/* Search */}
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="h-12 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-white/20"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="h-12 rounded-xl bg-white px-5 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-zinc-400">
            Running profit and risk analysis...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* KPI CARDS */}
            <RealtimeMetrics />

            <div className="mt-8">
              <LiveOrders />
            </div>

            <div className="mt-8">
              <OperatorQueue />
            </div>

            <div className="mt-8">
              <AnomalyAlerts />
            </div>

            {/* GRID */}
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              {/* LEFT */}
              <div className="space-y-6">
                {/* Risk Analysis */}
                <Card>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Risk Analysis</h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        Explainable order risk breakdown
                      </p>
                    </div>

                    <div
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium",
                        riskStyles.bg,
                        riskStyles.text,
                        riskStyles.border,
                      )}
                    >
                      {data.risk.level} RISK
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Risk Score</span>
                      <span className="font-medium">{data.risk.score}/100</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/5">
                      <div
                        style={{ width: `${data.risk.score}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                      />
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="mt-8 grid gap-3">
                    {data.risk.reasons.map((reason, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                      >
                        <div className="h-2 w-2 rounded-full bg-red-400" />

                        <div className="text-sm text-zinc-300">{reason}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Profit Comparison */}
                <Card>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">
                      Decision Simulation
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Expected profitability across operational actions
                    </p>
                  </div>

                  <div className="space-y-5">
                    {data.decision.alternatives.map((item, index) => {
                      const maxProfit = Math.max(
                        ...data.decision.alternatives.map(
                          (x) => x.expected_profit,
                        ),
                      );

                      const width = (item.expected_profit / maxProfit) * 100;

                      const isBest =
                        item.action === data.decision.recommended_action;

                      return (
                        <div key={index}>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "rounded-lg px-2 py-1 text-xs font-medium",
                                  isBest
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-white/5 text-zinc-400",
                                )}
                              >
                                {item.action}
                              </div>

                              {isBest && (
                                <div className="text-xs text-green-400">
                                  Recommended
                                </div>
                              )}
                            </div>

                            <div className="font-semibold">
                              ₹{item.expected_profit}
                            </div>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-white/5">
                            <div
                              style={{ width: `${width}%` }}
                              className={cn(
                                "h-full rounded-full transition-all",
                                isBest
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : "bg-gradient-to-r from-zinc-500 to-zinc-400",
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Decision */}
                <Card>
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Recommended Action
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        Optimized for expected profitability
                      </p>
                    </div>

                    <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                      {data.decision.confidence}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6">
                    <div className="text-sm text-zinc-400">
                      Best Operational Strategy
                    </div>

                    <div className="mt-2 text-3xl font-bold text-green-400">
                      {data.decision.recommended_action}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-300">
                      {data.business_impact.notes}
                    </p>
                  </div>
                </Card>

                {/* Financial Impact */}
                <Card>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">Financial Impact</h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Estimated operational economics
                    </p>
                  </div>

                  <div className="space-y-5">
                    <ImpactRow
                      label="Expected Profit"
                      value={`₹${data.business_impact.expected_profit}`}
                      positive
                    />

                    <ImpactRow
                      label="Estimated Risk Cost"
                      value={`₹${data.business_impact.risk_cost}`}
                    />

                    <ImpactRow
                      label="Confidence"
                      value={data.decision.confidence}
                    />
                  </div>
                </Card>

                <div className="mt-8">
                  <AIReasoningPanel reasoning={data.ai_reasoning} />
                </div>

                <div className="mt-8">
                  <ReasoningTimeline />
                </div>

                {/* System */}
                <Card>
                  <div className="mb-5">
                    <h3 className="text-xl font-semibold">
                      System Intelligence
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm text-zinc-400">
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">
                      <span>Scoring Engine</span>
                      <span className="text-white">Active</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">
                      <span>Pincode Risk Layer</span>
                      <span className="text-white">Active</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">
                      <span>Profit Optimization</span>
                      <span className="text-white">Enabled</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">
      {children}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  glow,
}: {
  title: string;
  value: string;
  subtitle: string;
  glow: "red" | "yellow" | "green" | "blue";
}) {
  const glowStyles = {
    red: "from-red-500/20",
    yellow: "from-yellow-500/20",
    green: "from-green-500/20",
    blue: "from-blue-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl",
        "before:absolute before:inset-0 before:bg-gradient-to-br",
        glowStyles[glow],
      )}
    >
      <div className="relative z-10">
        <div className="text-sm text-zinc-500">{title}</div>

        <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>

        <div className="mt-2 text-sm text-zinc-400">{subtitle}</div>
      </div>
    </div>
  );
}

function ImpactRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4">
      <div className="text-zinc-400">{label}</div>

      <div
        className={cn(
          "font-semibold",
          positive ? "text-green-400" : "text-white",
        )}
      >
        {value}
      </div>
    </div>
  );
}

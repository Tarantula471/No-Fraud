import { useMetrics } from "../context/MetricsContext";

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="text-sm text-zinc-500">{label}</div>

      <div className={`mt-3 text-4xl font-bold ${color}`}>{value}</div>

      <div className="mt-2 text-sm text-zinc-500">Live updating</div>
    </div>
  );
}

export default function RealtimeMetrics() {
  const { metrics } = useMetrics();

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Orders Processed"
        value={metrics.totalOrders}
        color="text-white"
      />

      <MetricCard
        label="High Risk Orders"
        value={metrics.highRiskOrders}
        color="text-red-400"
      />

      <MetricCard
        label="Profit Saved"
        value={`₹${metrics.totalProfitSaved}`}
        color="text-green-400"
      />

      <MetricCard
        label="RTO Prevented"
        value={metrics.preventedRTOs}
        color="text-blue-400"
      />
    </div>
  );
}

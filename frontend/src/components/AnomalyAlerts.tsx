import { useAlerts } from "../context/AlertsContext";

export default function AnomalyAlerts() {
  const { alerts } = useAlerts();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Anomaly Alerts</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Real-time operational anomalies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />

          <span className="text-sm text-zinc-500">Monitoring</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-zinc-500">
            No anomalies detected
          </div>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-5 ${
              alert.severity === "HIGH"
                ? "border-red-500/20 bg-red-500/5"
                : "border-yellow-500/20 bg-yellow-500/5"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className={`text-xs uppercase tracking-wide ${
                    alert.severity === "HIGH"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {alert.type}
                </div>

                <div className="mt-2 text-sm text-white">{alert.message}</div>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  alert.severity === "HIGH"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {alert.severity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

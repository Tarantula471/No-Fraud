import { useEffect, useState } from "react";
import { useMetrics } from "../context/MetricsContext";

interface LiveOrder {
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

export default function LiveOrders() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const { updateMetrics } = useMetrics();

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/orders");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setOrders((prev) => [data, ...prev.slice(0, 7)]);
      updateMetrics(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Live Incoming Orders</h3>

          <p className="mt-1 text-sm text-zinc-500">
            Real-time operational stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

          <span className="text-sm text-zinc-500">LIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div>
              <div className="font-medium">{order.order_id}</div>

              <div className="mt-1 text-sm text-zinc-500">
                {order.decision.recommended_action}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                ₹{order.business_impact.expected_profit}
              </div>

              <div
                className={`mt-1 text-xs ${
                  order.risk.level === "HIGH"
                    ? "text-red-400"
                    : order.risk.level === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
              >
                {order.risk.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

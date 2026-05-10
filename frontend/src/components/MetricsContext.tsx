import { createContext, useContext, useState, ReactNode } from "react";

interface Metrics {
  totalOrders: number;
  highRiskOrders: number;
  totalProfitSaved: number;
  preventedRTOs: number;
}

interface MetricsContextType {
  metrics: Metrics;

  updateMetrics: (data: {
    risk: {
      level: string;
      probability_of_rto: number;
    };

    business_impact: {
      expected_profit: number;
    };
  }) => void;
}

const MetricsContext = createContext<MetricsContextType | null>(null);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<Metrics>({
    totalOrders: 0,
    highRiskOrders: 0,
    totalProfitSaved: 0,
    preventedRTOs: 0,
  });

  function updateMetrics(data: any) {
    setMetrics((prev) => ({
      totalOrders: prev.totalOrders + 1,

      highRiskOrders:
        data.risk.level === "HIGH"
          ? prev.highRiskOrders + 1
          : prev.highRiskOrders,

      totalProfitSaved:
        prev.totalProfitSaved + data.business_impact.expected_profit,

      preventedRTOs:
        data.risk.probability_of_rto > 0.7
          ? prev.preventedRTOs + 1
          : prev.preventedRTOs,
    }));
  }

  return (
    <MetricsContext.Provider
      value={{
        metrics,
        updateMetrics,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);

  if (!context) {
    throw new Error("useMetrics must be used inside MetricsProvider");
  }

  return context;
}

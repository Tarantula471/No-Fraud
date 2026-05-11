import { createContext, useContext, useState, ReactNode } from "react";

interface Alert {
  id: number;
  type: string;
  message: string;
  severity: "HIGH" | "MEDIUM";
}

interface AlertsContextType {
  alerts: Alert[];

  analyzeAnomaly: (data: any) => void;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [highRiskCount, setHighRiskCount] = useState(0);

  function addAlert(alert: Alert) {
    setAlerts((prev) => [alert, ...prev.slice(0, 7)]);
  }

  function analyzeAnomaly(data: any) {
    // HIGH RISK SPIKE
    if (data.risk.level === "HIGH") {
      const nextCount = highRiskCount + 1;

      setHighRiskCount(nextCount);

      if (nextCount >= 5) {
        addAlert({
          id: Date.now(),

          type: "HIGH_RISK_SPIKE",

          severity: "HIGH",

          message: "Spike detected in HIGH risk incoming orders",
        });

        setHighRiskCount(0);
      }
    }

    // LOW PROFIT ALERT
    if (data.business_impact.expected_profit < 200) {
      addAlert({
        id: Date.now(),

        type: "LOW_PROFIT",

        severity: "MEDIUM",

        message: "Low profitability order detected",
      });
    }

    // HIGH RTO PROBABILITY
    if (data.risk.probability_of_rto > 0.85) {
      addAlert({
        id: Date.now(),

        type: "RTO_SURGE",

        severity: "HIGH",

        message: "Extremely high RTO probability detected",
      });
    }
  }

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        analyzeAnomaly,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);

  if (!context) {
    throw new Error("useAlerts must be inside AlertsProvider");
  }

  return context;
}

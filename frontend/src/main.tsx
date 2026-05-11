import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MetricsProvider } from "./components/MetricsContext.tsx";
import { AlertsProvider } from "./context/AlertsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertsContext>
      <MetricsProvider>
        <App />
      </MetricsProvider>
    </AlertsContext>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MetricsProvider } from "./components/MetricsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MetricsProvider>
      <App />
    </MetricsProvider>
  </StrictMode>,
);

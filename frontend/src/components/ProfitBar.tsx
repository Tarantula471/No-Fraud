// src/components/ProfitBar.tsx

interface ProfitBarProps {
  action: string;
  profit: number;
  isBest?: boolean;
}

export default function ProfitBar({
  action,
  profit,
  isBest = false,
}: ProfitBarProps) {
  return (
    <div
      style={{
        marginBottom: "16px",
        padding: "12px",
        border: isBest ? "2px solid green" : "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <strong>{action}</strong>
        <span>₹{profit}</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#eee",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(profit / 10, 5)}px`,
            height: "100%",
            background: isBest ? "green" : "#2563eb",
          }}
        />
      </div>
    </div>
  );
}

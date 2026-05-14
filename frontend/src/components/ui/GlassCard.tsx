import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;

  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/[0.06]
        bg-white/[0.03]
        shadow-2xl
        backdrop-blur-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}

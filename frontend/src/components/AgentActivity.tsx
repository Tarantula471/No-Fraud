import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

import GlassCard from "./ui/GlassCard";

export default function AgentActivity() {
  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.06] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/10">
                <Sparkles size={18} className="text-blue-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  AI Agent Activity
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Real-time operational investigation workflow
                </p>
              </div>
            </div>
          </div>

          {/* Live Status */}
          <div className="flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Agents Active
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="relative p-6">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-[33px] top-0 w-px bg-white/[0.06]" />

        <div className="space-y-5">
          <AgentStep
            status="complete"
            title="Pincode Reliability Analysis"
            description="Compared delivery success rates against regional operational baselines."
            meta="Risk Investigation Agent"
            time="2 sec ago"
            icon={<Shield size={16} className="text-emerald-400" />}
          />

          <AgentStep
            status="complete"
            title="Historical RTO Trend Analysis"
            description="Retrieved semantic fraud similarities from historical operational memory."
            meta="Memory Retrieval Agent"
            time="5 sec ago"
            icon={<TrendingUp size={16} className="text-blue-400" />}
          />

          <AgentStep
            status="warning"
            title="Elevated COD Exposure Detected"
            description="Detected unusually high late-night COD risk correlation in this region."
            meta="Profit Optimization Agent"
            time="Just now"
            icon={<AlertTriangle size={16} className="text-amber-400" />}
          />

          <AgentStep
            status="processing"
            title="Operator Queue Prioritization"
            description="Assigning investigation priority based on expected financial exposure."
            meta="Routing Agent"
            time="Running..."
            icon={<Clock3 size={16} className="text-violet-400" />}
          />
        </div>
      </div>
    </GlassCard>
  );
}

interface AgentStepProps {
  status: "complete" | "warning" | "processing";

  title: string;

  description: string;

  meta: string;

  time: string;

  icon: React.ReactNode;
}

function AgentStep({
  status,
  title,
  description,
  meta,
  time,
  icon,
}: AgentStepProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="relative flex gap-4"
    >
      {/* Status Icon */}
      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-2xl
          border
          backdrop-blur-xl

          ${getStepStyles(status)}
        `}
      >
        {status === "complete" ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 rounded-3xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-xl">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium text-white">{title}</div>

            <div className="mt-2 text-sm leading-6 text-zinc-400">
              {description}
            </div>
          </div>

          <div className="text-xs whitespace-nowrap text-zinc-500">{time}</div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="h-2 w-2 rounded-full bg-blue-400" />

            {meta}
          </div>

          <StatusBadge status={status} />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "complete") {
    return (
      <div className="rounded-full border border-emerald-500/10 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
        Completed
      </div>
    );
  }

  if (status === "warning") {
    return (
      <div className="rounded-full border border-amber-500/10 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
        Attention Needed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-violet-500/10 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
      <div className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
      Processing
    </div>
  );
}

function getStepStyles(status: string) {
  switch (status) {
    case "complete":
      return `
        border-emerald-500/10
        bg-emerald-500/10
      `;

    case "warning":
      return `
        border-amber-500/10
        bg-amber-500/10
      `;

    case "processing":
      return `
        border-violet-500/10
        bg-violet-500/10
      `;

    default:
      return `
        border-white/[0.06]
        bg-white/[0.03]
      `;
  }
}

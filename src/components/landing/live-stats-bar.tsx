"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, ArrowUpDown, Zap } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function LiveStatsBar() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Credits Traded Today",
      value: "2.4M",
      icon: <ArrowUpDown className="size-4" />,
      trend: "up",
    },
    {
      label: "Active Traders",
      value: "12,847",
      icon: <Users className="size-4" />,
      trend: "up",
    },
    {
      label: "Avg. GPT-4o Price",
      value: "$0.0028",
      icon: <TrendingUp className="size-4" />,
      trend: "down",
    },
    {
      label: "Total Volume (24h)",
      value: "$847K",
      icon: <Zap className="size-4" />,
      trend: "up",
    },
  ]);

  // Simulate live updates (will connect to SSE later)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.label === "Credits Traded Today") {
            const current = 2400000 + Math.floor(Math.random() * 10000);
            return { ...stat, value: `${(current / 1000000).toFixed(1)}M` };
          }
          if (stat.label === "Active Traders") {
            const current = 12800 + Math.floor(Math.random() * 100);
            return { ...stat, value: current.toLocaleString() };
          }
          return stat;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-y border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-border/40 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 py-4 sm:py-5 px-2"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {stat.icon}
                <span className="text-xs font-medium">{stat.label}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground tabular-nums animate-count-up">
                {stat.value}
              </div>
              {stat.trend && (
                <span
                  className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? "+" : "-"}
                  {(Math.random() * 5).toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

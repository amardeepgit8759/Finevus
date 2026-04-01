"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/Card";

export function AIInsightCard() {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai-insights", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.insight) setInsight(data.insight);
        else setInsight("Unable to generate insight at this time.");
      })
      .catch(() => setInsight("Failed to connect to AI advisor."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-transparent to-transparent border-primary/30 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-primary/5">
      <div className="absolute inset-0 bg-[#22c55e] opacity-[0.03] mix-blend-overlay"></div>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
        <div className="p-3 bg-primary/20 rounded-2xl text-primary shadow-[0_0_25px_rgba(34,197,94,0.4)] shrink-0 self-start sm:self-auto relative">
          <div className="absolute inset-0 rounded-2xl border border-primary/30 animate-ping opacity-20" />
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground flex items-center">
            AI Insight
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Smart</span>
          </h3>
          {loading ? (
            <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Analyzing your transactions...</span>
            </div>
          ) : (
            <p className="text-sm font-medium text-foreground mt-1 leading-relaxed">
              {insight}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

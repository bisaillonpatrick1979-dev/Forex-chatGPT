import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { LearningStatistics } from "@/components/LearningStatistics";
import { MarketWatch } from "@/components/MarketWatch";
import { PageHeader } from "@/components/PageHeader";
import { PaperTradingPanel } from "@/components/PaperTradingPanel";
import { PredictionPanel } from "@/components/PredictionPanel";
import { StatCard } from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Command center" title="Multi-agent scalping research" description="Tablet-first dark dashboard for Forex and Nasdaq paper-trading research. All prices, predictions, orders, and outcomes are mock data until demo integrations are added." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mode" value="Paper" detail="Live trading disabled" tone="green" />
        <StatCard label="Tracked markets" value="4" detail="Forex majors + NAS100" />
        <StatCard label="Open paper P/L" value="$115" detail="Simulated account" tone="green" />
        <StatCard label="Risk block" value="1" detail="Upcoming USD event" tone="amber" />
      </div>
      <MarketWatch />
      <div className="grid gap-8 xl:grid-cols-2">
        <PredictionPanel />
        <PaperTradingPanel />
      </div>
      <LearningStatistics />
      <AgentStatusPanel />
    </div>
  );
}

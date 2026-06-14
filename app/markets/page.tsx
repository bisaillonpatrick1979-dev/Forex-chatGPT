import { MarketWatch } from "@/components/MarketWatch";
import { PageHeader } from "@/components/PageHeader";

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Markets" title="Market watcher workspace" description="Monitor mock Forex and Nasdaq conditions with large tablet-friendly price cards, spread warnings, session context, and volatility labels." />
      <MarketWatch />
    </div>
  );
}

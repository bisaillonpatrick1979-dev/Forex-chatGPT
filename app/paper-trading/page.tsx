import { PageHeader } from "@/components/PageHeader";
import { PaperTradingPanel } from "@/components/PaperTradingPanel";

export default function PaperTradingPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Paper Trading" title="Simulated execution ledger" description="The Risk Manager only creates mock orders. This page intentionally has no live execution controls, broker buttons, or real account balances." />
      <PaperTradingPanel />
    </div>
  );
}

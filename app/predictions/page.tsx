import { PageHeader } from "@/components/PageHeader";
import { PredictionPanel } from "@/components/PredictionPanel";

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Predictions" title="Prediction audit queue" description="Every model idea is saved with strategy, confidence, reason, market conditions, risk status, and paper-trade outcome links." />
      <PredictionPanel />
    </div>
  );
}

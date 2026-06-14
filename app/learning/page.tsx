import { LearningStatistics } from "@/components/LearningStatistics";
import { PageHeader } from "@/components/PageHeader";

export default function LearningPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Learning" title="Error learning loop" description="Track mistakes, lucky wins, false breakouts, spread problems, and candidate improvements that must be backtested before use." />
      <LearningStatistics />
    </div>
  );
}

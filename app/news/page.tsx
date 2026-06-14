import { NewsFeed } from "@/components/NewsFeed";
import { PageHeader } from "@/components/PageHeader";

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="News" title="Economic calendar risk" description="The News and Economic Calendar Agent annotates predictions with event risk and keeps paper strategies out of unsafe macro windows." />
      <NewsFeed />
    </div>
  );
}

import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { PageHeader } from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="Paper-first configuration" description="Configuration placeholders for future Supabase and demo API wiring. Live trading remains disabled by design." />
      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Trading mode", "Paper only", "Only simulated orders are allowed in this build."],
          ["Data provider", "Mock feed", "OANDA or another demo API can be connected later."],
          ["Max daily drawdown", "2.0%", "Risk Manager rejects paper ideas beyond the configured limit."],
          ["News guard", "Enabled", "High-impact macro windows can block new paper trades."],
        ].map(([label, value, detail]) => (
          <article key={label} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-black text-white">{value}</p>
            <p className="mt-3 text-lg text-slate-300">{detail}</p>
          </article>
        ))}
      </section>
      <AgentStatusPanel />
    </div>
  );
}

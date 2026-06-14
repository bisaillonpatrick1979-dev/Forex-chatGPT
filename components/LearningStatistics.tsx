import { learningEvents } from "@/lib/mock-data";

export function LearningStatistics() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-300">Error Learning Agent</p>
      <h2 className="mt-2 text-3xl font-black text-white">Learning memory</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Events</p>
          <p className="mt-3 text-5xl font-black text-white">{learningEvents.length}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">High Severity</p>
          <p className="mt-3 text-5xl font-black text-rose-200">{learningEvents.filter((event) => event.severity === "high").length}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Backtest Queue</p>
          <p className="mt-3 text-5xl font-black text-sky-200">2</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {learningEvents.map((event) => (
          <article key={event.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-fuchsia-400/10 px-3 py-1 text-sm font-black text-fuchsia-200">{event.errorType}</span>
              <span className="text-lg font-bold text-slate-400">{event.symbol}</span>
              <span className="text-base text-slate-500">{event.createdAt}</span>
            </div>
            <p className="mt-3 text-xl leading-8 text-slate-200">{event.lesson}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

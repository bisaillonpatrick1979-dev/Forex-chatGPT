import { news } from "@/lib/mock-data";

const impactClass = {
  low: "bg-slate-700 text-slate-200",
  medium: "bg-amber-400/15 text-amber-200",
  high: "bg-rose-400/15 text-rose-200",
};

export function NewsFeed() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-300">News Calendar Agent</p>
      <h2 className="mt-2 text-3xl font-black text-white">Macro risk feed</h2>
      <div className="mt-6 space-y-4">
        {news.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-black uppercase ${impactClass[item.impact]}`}>{item.impact}</span>
              <span className="text-lg font-bold text-slate-300">{item.time}</span>
              <span className="text-base text-slate-500">{item.symbols.join(" • ")}</span>
            </div>
            <h3 className="mt-4 text-2xl font-black text-white">{item.title}</h3>
            <p className="mt-2 text-lg leading-8 text-slate-300">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { markets } from "@/lib/mock-data";

export function MarketWatch() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Market Watcher</p>
          <h2 className="mt-2 text-3xl font-black text-white">Live mock market board</h2>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-lg font-bold text-emerald-200">Paper data only</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {markets.map((market) => (
          <article key={market.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-white">{market.symbol}</h3>
                <p className="text-base text-slate-400">{market.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${market.changePercent >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>
                {market.changePercent >= 0 ? "+" : ""}{market.changePercent}%
              </span>
            </div>
            <p className="mt-6 text-4xl font-black text-white">{market.price.toLocaleString()}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-lg">
              <div className="rounded-2xl bg-slate-950 p-3">
                <p className="text-sm uppercase text-slate-500">Spread</p>
                <p className="font-bold text-slate-100">{market.spread} pts</p>
              </div>
              <div className="rounded-2xl bg-slate-950 p-3">
                <p className="text-sm uppercase text-slate-500">Volatility</p>
                <p className="font-bold capitalize text-slate-100">{market.volatility}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

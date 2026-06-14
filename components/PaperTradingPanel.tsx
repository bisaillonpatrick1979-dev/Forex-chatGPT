import { paperTrades } from "@/lib/mock-data";

export function PaperTradingPanel() {
  const totalPnl = paperTrades.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-950/20 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">Paper Trading Engine</p>
          <h2 className="mt-2 text-3xl font-black text-white">Simulated positions only</h2>
        </div>
        <div className="rounded-3xl bg-slate-950 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Mock P/L</p>
          <p className="text-4xl font-black text-emerald-200">${totalPnl.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800">
        <div className="grid grid-cols-5 bg-slate-950 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          <span>Symbol</span><span>Side</span><span>Entry</span><span>P/L</span><span>Status</span>
        </div>
        {paperTrades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-5 items-center border-t border-slate-800 px-5 py-4 text-lg text-slate-200">
            <span className="font-black text-white">{trade.symbol}</span>
            <span className={trade.direction === "long" ? "text-emerald-300" : "text-rose-300"}>{trade.direction}</span>
            <span>{trade.entry}</span>
            <span className={trade.pnl >= 0 ? "font-black text-emerald-300" : "font-black text-rose-300"}>${trade.pnl.toFixed(2)}</span>
            <span className="capitalize">{trade.status}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-lg font-bold text-amber-100">
        Live trading is disabled. This app is restricted to mock data and simulated paper trades.
      </p>
    </section>
  );
}

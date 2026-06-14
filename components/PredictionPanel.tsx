import { predictions } from "@/lib/mock-data";

export function PredictionPanel() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-300">Scalping Strategy Agent</p>
      <h2 className="mt-2 text-3xl font-black text-white">Prediction queue</h2>
      <div className="mt-6 space-y-4">
        {predictions.map((prediction) => (
          <article key={prediction.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-400">{prediction.createdAt} • {prediction.strategy}</p>
                <h3 className="text-3xl font-black text-white">{prediction.symbol} {prediction.direction.toUpperCase()}</h3>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Confidence</p>
                <p className="text-4xl font-black text-sky-200">{prediction.confidence}%</p>
              </div>
            </div>
            <p className="mt-4 text-lg leading-8 text-slate-300">{prediction.reason}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-base font-bold">
              <span className="rounded-full bg-slate-950 px-4 py-2 text-slate-200">R:R {prediction.riskReward}</span>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-slate-200">{prediction.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

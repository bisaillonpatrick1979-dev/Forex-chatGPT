import { agentLogs } from "@/lib/mock-data";

const statusClass = {
  online: "bg-emerald-400",
  observing: "bg-sky-400",
  blocked: "bg-rose-400",
  learning: "bg-fuchsia-400",
};

export function AgentStatusPanel() {
  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-300">Agent Mesh</p>
      <h2 className="mt-2 text-3xl font-black text-white">System status</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agentLogs.map((log) => (
          <article key={log.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <span className={`h-4 w-4 rounded-full ${statusClass[log.status]}`} />
              <h3 className="text-2xl font-black text-white">{log.agent}</h3>
            </div>
            <p className="mt-3 text-lg leading-7 text-slate-300">{log.message}</p>
            <p className="mt-4 text-base font-bold uppercase tracking-[0.2em] text-slate-500">{log.status} • {log.updatedAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "red" | "blue" | "amber";
}

const toneClass = {
  green: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  red: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  blue: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
};

export function StatCard({ label, value, detail, tone = "blue" }: StatCardProps) {
  return (
    <div className={`rounded-3xl border p-6 shadow-2xl shadow-black/20 ${toneClass[tone]}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">{value}</p>
      <p className="mt-3 text-lg text-slate-300">{detail}</p>
    </div>
  );
}

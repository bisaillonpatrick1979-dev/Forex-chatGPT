interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 md:p-8">
      <p className="text-sm font-black uppercase tracking-[0.34em] text-sky-300">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">{title}</h1>
      <p className="mt-4 max-w-4xl text-xl leading-9 text-slate-300">{description}</p>
    </div>
  );
}

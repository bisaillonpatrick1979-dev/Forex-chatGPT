import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forex ChatGPT Paper Trading Research",
  description: "Multi-agent Forex and Nasdaq scalping research app using paper trading only.",
};

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Markets", "/markets"],
  ["News", "/news"],
  ["Predictions", "/predictions"],
  ["Paper Trading", "/paper-trading"],
  ["Learning", "/learning"],
  ["Settings", "/settings"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:px-8 xl:flex-row xl:items-center xl:justify-between">
              <Link href="/dashboard" className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-400 text-2xl font-black text-slate-950">FX</span>
                <div>
                  <p className="text-2xl font-black text-white">Forex ChatGPT</p>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">Paper trading only</p>
                </div>
              </Link>
              <nav className="flex gap-2 overflow-x-auto pb-1">
                {navItems.map(([label, href]) => (
                  <Link key={href} href={href} className="whitespace-nowrap rounded-full border border-slate-800 bg-slate-900 px-4 py-3 text-base font-bold text-slate-200 transition hover:border-sky-400 hover:text-white">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

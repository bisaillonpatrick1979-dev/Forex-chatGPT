import type { AgentLog, LearningEvent, Market, NewsItem, PaperTrade, Prediction } from "./types";

export const markets: Market[] = [
  { id: "1", symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.08241, changePercent: 0.18, spread: 0.8, session: "London / New York", volatility: "normal" },
  { id: "2", symbol: "GBP/USD", name: "British Pound / US Dollar", price: 1.27488, changePercent: -0.11, spread: 1.1, session: "London / New York", volatility: "high" },
  { id: "3", symbol: "USD/JPY", name: "US Dollar / Japanese Yen", price: 157.214, changePercent: 0.27, spread: 0.9, session: "New York", volatility: "normal" },
  { id: "4", symbol: "NAS100", name: "Nasdaq 100 Demo CFD", price: 19482.6, changePercent: 0.42, spread: 1.7, session: "US Cash", volatility: "high" },
];

export const predictions: Prediction[] = [
  { id: "p1", symbol: "EUR/USD", direction: "long", confidence: 72, strategy: "Pullback-to-Trend", reason: "Bullish micro-trend with controlled pullback and normal spread. No high-impact event in the active block window.", riskReward: "1:1.6", status: "approved", createdAt: "09:41 UTC" },
  { id: "p2", symbol: "NAS100", direction: "no-trade", confidence: 81, strategy: "News Avoidance", reason: "Volatility is elevated and price is near a pre-market liquidity pocket. Paper engine will stand aside.", riskReward: "N/A", status: "rejected", createdAt: "09:44 UTC" },
  { id: "p3", symbol: "GBP/USD", direction: "short", confidence: 64, strategy: "Momentum Continuation", reason: "Range breakdown detected, but spread is close to the warning threshold. Reduced confidence applied.", riskReward: "1:1.3", status: "watching", createdAt: "09:48 UTC" },
];

export const paperTrades: PaperTrade[] = [
  { id: "t1", symbol: "EUR/USD", direction: "long", entry: 1.0819, current: 1.08241, pnl: 51.0, risk: 35, status: "open" },
  { id: "t2", symbol: "USD/JPY", direction: "short", entry: 157.31, current: 157.214, pnl: 64.25, risk: 40, status: "open" },
  { id: "t3", symbol: "NAS100", direction: "long", entry: 19420.5, current: 19482.6, pnl: 124.2, risk: 75, status: "closed" },
];

export const news: NewsItem[] = [
  { id: "n1", title: "US inflation expectations due later today", impact: "high", symbols: ["USD", "NAS100"], time: "12:00 UTC", summary: "High-impact USD window. New predictions should enter caution mode before the release." },
  { id: "n2", title: "ECB speaker reiterates data-dependent rate path", impact: "medium", symbols: ["EUR/USD"], time: "10:30 UTC", summary: "EUR pairs may see headline-driven volatility during the speech window." },
  { id: "n3", title: "Tokyo session liquidity normalizes after holiday", impact: "low", symbols: ["USD/JPY"], time: "07:15 UTC", summary: "No trade block required, but historical comparisons should mark holiday liquidity." },
];

export const learningEvents: LearningEvent[] = [
  { id: "l1", errorType: "late_entry", symbol: "NAS100", lesson: "Avoid momentum entries more than 0.35 ATR from the breakout trigger.", severity: "medium", createdAt: "Today" },
  { id: "l2", errorType: "spread_too_high", symbol: "GBP/USD", lesson: "Require three stable quote updates after spread widens above the 80th percentile.", severity: "high", createdAt: "Yesterday" },
  { id: "l3", errorType: "lucky_win", symbol: "EUR/USD", lesson: "Do not reinforce trades where thesis was invalidated before target was hit.", severity: "low", createdAt: "This week" },
];

export const agentLogs: AgentLog[] = [
  { id: "a1", agent: "Market Watcher", status: "online", message: "Streaming mock quote snapshots across 4 symbols.", updatedAt: "12s ago" },
  { id: "a2", agent: "Scalping Strategy", status: "observing", message: "Evaluating pullback, range, and momentum playbooks.", updatedAt: "18s ago" },
  { id: "a3", agent: "News Calendar", status: "blocked", message: "USD high-impact event enters caution window soon.", updatedAt: "1m ago" },
  { id: "a4", agent: "Risk Manager", status: "online", message: "Paper trading guardrail active. Live order routing disabled.", updatedAt: "22s ago" },
  { id: "a5", agent: "Error Learning", status: "learning", message: "Clustering recent false breakout and spread-cost mistakes.", updatedAt: "3m ago" },
  { id: "a6", agent: "Backtesting", status: "observing", message: "Awaiting approved learning candidates for replay.", updatedAt: "5m ago" },
];

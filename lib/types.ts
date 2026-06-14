export type AgentStatus = "online" | "observing" | "blocked" | "learning";
export type TradeDirection = "long" | "short" | "no-trade";
export type TradeStatus = "open" | "closed" | "rejected";

export interface Market {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  spread: number;
  session: string;
  volatility: "low" | "normal" | "high";
}

export interface Prediction {
  id: string;
  symbol: string;
  direction: TradeDirection;
  confidence: number;
  strategy: string;
  reason: string;
  riskReward: string;
  status: "watching" | "approved" | "paper-filled" | "rejected";
  createdAt: string;
}

export interface PaperTrade {
  id: string;
  symbol: string;
  direction: Exclude<TradeDirection, "no-trade">;
  entry: number;
  current: number;
  pnl: number;
  risk: number;
  status: TradeStatus;
}

export interface NewsItem {
  id: string;
  title: string;
  impact: "low" | "medium" | "high";
  symbols: string[];
  time: string;
  summary: string;
}

export interface LearningEvent {
  id: string;
  errorType: string;
  symbol: string;
  lesson: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
}

export interface AgentLog {
  id: string;
  agent: string;
  status: AgentStatus;
  message: string;
  updatedAt: string;
}

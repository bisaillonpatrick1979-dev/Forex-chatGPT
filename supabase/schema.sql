-- Forex ChatGPT paper-trading research schema
-- This schema stores mock/demo research data only. It does not enable live trading.

create extension if not exists pgcrypto;

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  display_name text not null,
  asset_class text not null check (asset_class in ('forex', 'index_cfd', 'futures', 'etf')),
  provider text not null default 'mock',
  bid numeric(18, 8),
  ask numeric(18, 8),
  mid numeric(18, 8),
  spread numeric(18, 8),
  session_name text,
  volatility_regime text check (volatility_regime in ('low', 'normal', 'high')),
  data_quality_flags jsonb not null default '[]'::jsonb,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  impact text not null check (impact in ('low', 'medium', 'high')),
  affected_symbols text[] not null default '{}',
  source text not null default 'mock',
  event_time timestamptz,
  ingested_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  market_id uuid references public.markets(id) on delete set null,
  symbol text not null,
  direction text not null check (direction in ('long', 'short', 'no-trade')),
  confidence numeric(5, 2) not null check (confidence >= 0 and confidence <= 100),
  strategy_name text not null,
  strategy_version text not null default 'mock-v1',
  reasoning_summary text not null,
  market_conditions jsonb not null default '{}'::jsonb,
  news_context jsonb not null default '{}'::jsonb,
  risk_reward text,
  status text not null check (status in ('watching', 'approved', 'paper-filled', 'rejected', 'closed')),
  model_version text not null default 'mock-agent',
  created_at timestamptz not null default now(),
  evaluated_at timestamptz
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid references public.predictions(id) on delete set null,
  symbol text not null,
  direction text not null check (direction in ('long', 'short')),
  mode text not null default 'paper' check (mode = 'paper'),
  quantity numeric(18, 4) not null default 1,
  entry_price numeric(18, 8) not null,
  current_price numeric(18, 8),
  exit_price numeric(18, 8),
  stop_loss numeric(18, 8),
  take_profit numeric(18, 8),
  paper_pnl numeric(18, 4) not null default 0,
  simulated_fees numeric(18, 4) not null default 0,
  status text not null check (status in ('open', 'closed', 'rejected')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  status text not null check (status in ('online', 'observing', 'blocked', 'learning', 'error')),
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_events (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid references public.predictions(id) on delete set null,
  trade_id uuid references public.trades(id) on delete set null,
  symbol text not null,
  error_type text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  lesson text not null,
  root_cause_hypothesis text,
  recommended_rule_change text,
  requires_backtest boolean not null default true,
  approved_for_strategy_update boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists markets_symbol_idx on public.markets(symbol);
create index if not exists predictions_symbol_created_idx on public.predictions(symbol, created_at desc);
create index if not exists trades_symbol_status_idx on public.trades(symbol, status);
create index if not exists news_event_time_idx on public.news(event_time desc);
create index if not exists agent_logs_agent_created_idx on public.agent_logs(agent_name, created_at desc);
create index if not exists learning_events_symbol_created_idx on public.learning_events(symbol, created_at desc);

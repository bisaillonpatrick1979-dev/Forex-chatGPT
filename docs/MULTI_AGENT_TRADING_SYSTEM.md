# Multi-Agent Trading Research System

## Purpose and Safety Boundary

This system is a research-first, paper-trading-only application for studying Forex and Nasdaq scalping ideas with multiple AI agents. The first production milestone must not place live trades, route real money orders, or store live brokerage credentials. Every order, fill, profit/loss value, and account balance in the initial release is simulated.

The architecture should make the paper-trading constraint explicit:

- Use a `TradingMode` configuration with `paper` as the only enabled value for the first release.
- Keep broker execution adapters behind an interface and provide only a paper execution adapter initially.
- Add OANDA, another Forex demo API, or Nasdaq market-data integrations later for real-time data ingestion and demo execution.
- Require a feature flag, environment separation, and manual review before any non-paper adapter can be enabled.

## System Goals

The app should help researchers evaluate short-term market hypotheses by coordinating specialized agents that observe data, generate trade ideas, filter risk, simulate outcomes, and learn from errors. It must record the full lifecycle of every prediction so future decisions can be audited and improved.

Core goals:

1. Generate structured scalping predictions for Forex pairs and Nasdaq instruments.
2. Capture market context, strategy rationale, news conditions, source reputation, and risk constraints at prediction time.
3. Simulate orders and fills in a paper trading ledger.
4. Evaluate each prediction after a defined horizon or exit event.
5. Store mistakes, missed opportunities, and successful patterns for systematic learning.
6. Support later integration with OANDA or another demo API without changing agent contracts.

## High-Level Architecture

```text
                  +------------------------------+
                  |  External Data Connectors    |
                  |  - Historical candles        |
                  |  - Real-time demo feeds      |
                  |  - News/calendar feeds       |
                  |  - Trader/source feeds       |
                  +---------------+--------------+
                                  |
                                  v
+-------------------+    +------------------------+    +----------------------+
| Market Watcher    | -> | Shared Market Context  | <- | News & Calendar      |
| Agent             |    | Store / Feature Cache  |    | Agent                |
+---------+---------+    +-----------+------------+    +----------+-----------+
          |                          |                            |
          v                          v                            v
+-------------------+    +------------------------+    +----------------------+
| Scalping Strategy | -> | Prediction Registry    | <- | Trader Source        |
| Agent             |    | and Audit Journal      |    | Reputation Agent     |
+---------+---------+    +-----------+------------+    +----------+-----------+
          |                          |                            |
          v                          v                            |
+-------------------+    +------------------------+               |
| Risk Manager      | -> | Paper Trading Engine   | <-------------+
| Agent             |    | and Simulated Ledger   |
+---------+---------+    +-----------+------------+
          |                          |
          v                          v
+-------------------+    +------------------------+
| Backtesting       | <- | Outcome Evaluator      |
| Agent             |    | and Metrics Store      |
+---------+---------+    +-----------+------------+
          |                          |
          v                          v
+--------------------------------------------------+
| Error Learning Agent / Learning Memory Store      |
+--------------------------------------------------+
```

## Shared Domain Objects

All agents should exchange typed, versioned messages instead of free-form text. Suggested core objects are below.

### Market Snapshot

A `MarketSnapshot` captures the conditions visible when an agent evaluates a symbol.

Required fields:

- `snapshot_id`
- `timestamp_utc`
- `symbol`
- `asset_class` such as `forex`, `index_cfd`, `futures`, or `equity_etf`
- `timeframe`
- `bid`, `ask`, `mid`, and `spread`
- `ohlcv_window`
- `session` such as London, New York, Tokyo, or overlap
- `volatility_features`
- `trend_features`
- `liquidity_features`
- `support_resistance_levels`
- `data_source`
- `data_quality_flags`

### Prediction Record

Every AI prediction must be stored before the simulated trade is accepted or rejected.

Required fields:

- `prediction_id`
- `created_at_utc`
- `agent_version`
- `symbol`
- `direction` such as long, short, or no-trade
- `entry_plan`
- `stop_loss`
- `take_profit`
- `time_horizon_seconds`
- `confidence_score`
- `strategy_name`
- `market_snapshot_id`
- `news_context_id`
- `source_reputation_context_id`
- `risk_assessment_id`
- `reasoning_summary`
- `invalidating_conditions`
- `paper_order_id`
- `status`

### Outcome Record

The outcome record closes the loop for a prediction.

Required fields:

- `outcome_id`
- `prediction_id`
- `evaluated_at_utc`
- `exit_reason`
- `entry_price`
- `exit_price`
- `maximum_favorable_excursion`
- `maximum_adverse_excursion`
- `paper_pnl`
- `fees_and_spread_costs`
- `slippage_model_used`
- `win_loss_break_even`
- `rule_compliance_flags`
- `post_trade_notes`

### Learning Record

The learning record captures what the AI learned from a mistake or a validated pattern.

Required fields:

- `learning_id`
- `prediction_id`
- `created_at_utc`
- `error_type`
- `root_cause_hypothesis`
- `missed_signal`
- `false_signal`
- `market_regime`
- `recommended_rule_change`
- `requires_backtest`
- `approved_for_strategy_update`

## Agent Responsibilities

## 1. Market Watcher Agent

The Market Watcher Agent turns raw price data into normalized market context for other agents. It should not make trade recommendations by itself.

Responsibilities:

- Ingest historical and real-time candles, quotes, and spreads.
- Normalize symbols across providers.
- Detect market sessions, volatility regimes, and spread conditions.
- Compute features for short timeframes such as 1-second, 5-second, 15-second, 1-minute, and 5-minute bars.
- Identify immediate support/resistance zones, micro-trends, liquidity gaps, wick behavior, and range compression.
- Emit `MarketSnapshot` events at a configurable cadence.
- Flag stale data, widened spreads, missing candles, or provider anomalies.

Inputs:

- Historical candles.
- Real-time quotes from a later OANDA or demo API integration.
- Instrument metadata.
- Session schedule configuration.

Outputs:

- `MarketSnapshot`.
- `MarketRegimeChanged` events.
- `DataQualityAlert` events.

Key implementation notes:

- Start with replayable historical data and paper quote streams.
- Use deterministic feature calculations so backtesting and live paper trading agree.
- Store all raw data references needed to reconstruct a snapshot.

## 2. Scalping Strategy Agent

The Scalping Strategy Agent converts market context into structured trade predictions or no-trade decisions.

Responsibilities:

- Evaluate approved scalping playbooks against the latest `MarketSnapshot`.
- Generate long, short, or no-trade predictions.
- Explain the reason for the prediction using structured fields and a short natural-language summary.
- Define entry, stop, target, timeout, and invalidation conditions.
- Avoid trading during blocked news windows or poor data quality conditions.
- Attach a strategy name and version to every prediction.

Inputs:

- `MarketSnapshot`.
- News/calendar context.
- Source reputation context.
- Strategy configuration.
- Recent error-learning constraints.

Outputs:

- `PredictionRecord`.
- `NoTradeDecision`.

Key implementation notes:

- Predictions should be model-assisted but rules-constrained.
- Do not let the model invent missing data; missing inputs should produce a no-trade or low-confidence decision.
- Keep strategy prompts and rule definitions versioned for auditability.

## 3. News and Economic Calendar Agent

The News and Economic Calendar Agent protects the system from surprise volatility and annotates predictions with macro context.

Responsibilities:

- Track scheduled economic events relevant to Forex and Nasdaq scalping.
- Mark high-impact windows before, during, and after releases.
- Summarize recent market-moving news with source and timestamp metadata.
- Identify affected currencies, indices, and correlated symbols.
- Produce a trade-block, caution, or normal status for each symbol.

Inputs:

- Economic calendar feeds.
- News feeds.
- Central bank schedule data.
- Configured event impact rules.

Outputs:

- `NewsContext`.
- `EconomicEventWindow`.
- `TradeBlockRecommendation`.

Key implementation notes:

- Start with manually imported or free historical calendars for backtesting.
- Later add live calendar providers with provider-specific reliability scores.
- Preserve event timestamps in UTC and local market time.

## 4. Trader Source Reputation Agent

The Trader Source Reputation Agent evaluates signals, commentary, and trade ideas from external traders or communities without blindly trusting them.

Responsibilities:

- Track external trader, analyst, or community source records.
- Score each source by historical accuracy, timeliness, instrument expertise, and risk disclosure quality.
- Identify overfitted, vague, or unverifiable claims.
- Annotate a prediction when an external source supports or conflicts with it.
- Prevent social-media commentary from overriding risk or data-quality rules.

Inputs:

- External source posts or manually curated notes.
- Historical source calls.
- Prediction and outcome records.

Outputs:

- `SourceReputationContext`.
- `SourceSignal`.
- `SourceReliabilityUpdate`.

Key implementation notes:

- Store exact timestamps and URLs or references for source claims where legally permitted.
- Use source reputation as context, not as an automatic trade trigger.
- Separate source accuracy from popularity.

## 5. Risk Manager Agent

The Risk Manager Agent is the final gate before paper order creation.

Responsibilities:

- Enforce paper-trading-only mode.
- Validate position sizing, maximum risk per idea, daily drawdown limits, and symbol exposure.
- Reject predictions with poor reward-to-risk ratios, excessive spreads, stale data, or blocked news context.
- Convert approved predictions into paper orders.
- Track open simulated positions and account-level exposure.
- Emit risk decisions with explicit rejection reasons.

Inputs:

- `PredictionRecord`.
- Account simulation state.
- Current market snapshot.
- News/calendar status.
- Risk configuration.

Outputs:

- `RiskAssessment`.
- `PaperOrderRequest`.
- `PredictionRejected`.

Key implementation notes:

- The risk manager should be deterministic and testable.
- The AI can explain risk but should not bypass hard risk limits.
- Default initial risk should be conservative, such as fixed fractional paper risk and low maximum concurrent exposure.

## 6. Error Learning Agent

The Error Learning Agent reviews outcomes and creates learning records from both losses and process mistakes.

Responsibilities:

- Compare prediction rationale with actual market behavior.
- Classify errors such as bad trend read, late entry, spread too high, news shock, stop too tight, target too ambitious, or ignored regime shift.
- Detect repeated mistake patterns by strategy, symbol, session, and market regime.
- Recommend rule changes, prompt changes, feature additions, or strategy retirement candidates.
- Require backtesting before a recommendation becomes an active rule.

Inputs:

- Prediction records.
- Outcome records.
- Market snapshots before, during, and after the trade.
- News and source context.

Outputs:

- `LearningRecord`.
- `StrategyChangeCandidate`.
- `BacktestRequest`.

Key implementation notes:

- The agent should not directly modify live strategy behavior.
- Human approval or automated statistical validation should be required before deployment.
- Track lessons from winning trades too, especially lucky wins that violated the intended process.

## 7. Backtesting Agent

The Backtesting Agent validates strategies and learning proposals against historical data.

Responsibilities:

- Replay historical data using the same feature generation path as paper trading.
- Run strategy versions and candidate rule changes on defined date ranges.
- Include spread, slippage, latency, and news-window assumptions.
- Report performance by symbol, session, volatility regime, and news condition.
- Compare baseline and candidate strategy versions.
- Reject changes that improve headline performance but worsen drawdown, stability, or sample robustness.

Inputs:

- Historical candles and quotes.
- Historical economic calendars.
- Strategy definitions.
- Learning records and strategy change candidates.

Outputs:

- `BacktestRun`.
- `BacktestMetrics`.
- `StrategyValidationReport`.

Key implementation notes:

- Backtests must be reproducible with fixed data snapshots and versioned configuration.
- Avoid look-ahead bias by only exposing data available at each simulated timestamp.
- Use walk-forward validation before promoting strategy updates.

## Paper Trading Workflow

1. Market Watcher emits a `MarketSnapshot`.
2. News and Economic Calendar Agent attaches current event context.
3. Trader Source Reputation Agent attaches any relevant external-source context.
4. Scalping Strategy Agent generates a prediction or no-trade decision.
5. Prediction Registry stores the prediction and rationale before execution.
6. Risk Manager validates the prediction against hard limits.
7. Paper Trading Engine simulates an order, fill, stop, target, timeout, or manual close.
8. Outcome Evaluator records the result.
9. Error Learning Agent creates a learning record when appropriate.
10. Backtesting Agent tests proposed changes before they affect future decisions.

## Required Audit Trail

For every prediction, the system must persist:

- What symbol and timeframe were evaluated.
- What market conditions were visible at the time.
- What data sources were used.
- What the AI predicted.
- Why it made the prediction.
- Whether risk accepted or rejected it.
- What simulated order was created.
- What happened after entry.
- Whether the prediction was right or wrong.
- What the AI learned from any mistake.
- Which model, prompt, strategy version, and configuration produced the result.

## Suggested Services and Storage

Recommended components:

- Event bus for agent messages.
- Relational database for predictions, outcomes, source records, and audit data.
- Time-series store or partitioned tables for candles and market snapshots.
- Object storage for raw provider payloads and backtest artifacts.
- Vector or embedding store only for retrieval of notes and lessons, not as the source of truth.
- Metrics service for performance, latency, and data-quality monitoring.

## Release Phases

### Phase 1: Offline Research and Paper Simulation

- Historical data import.
- Deterministic feature generation.
- Paper trading ledger.
- Prediction and outcome audit tables.
- Backtesting reports.

### Phase 2: Real-Time Paper Trading

- Real-time data connector using OANDA demo API or another demo provider.
- Paper execution on live quotes.
- News/calendar live ingestion.
- Monitoring dashboard.

### Phase 3: Demo Broker Execution

- Demo account order placement only.
- Broker adapter abstraction.
- Reconciliation between broker demo fills and internal ledger.
- Strong kill switch and credential separation.

### Phase 4: Live Trading Review Gate

Live trading should require a separate design review, legal/compliance review, risk review, and explicit user approval. It is intentionally out of scope for the initial system.

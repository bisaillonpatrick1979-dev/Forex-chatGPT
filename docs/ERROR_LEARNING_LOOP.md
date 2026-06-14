# Error Learning Loop

## Purpose

The Error Learning Loop ensures the system does not merely record wins and losses, but learns why each prediction succeeded or failed. The loop must preserve a complete audit trail from market conditions to prediction rationale, simulated execution, outcome, error classification, and validated strategy improvement.

The Error Learning Agent may recommend changes, but it must not directly deploy them. All material changes should pass through backtesting and review before affecting future paper-trading decisions.

## End-to-End Loop

1. A strategy creates a `PredictionRecord` with market context and reasoning.
2. The Risk Manager either rejects it or sends it to the paper trading engine.
3. The paper trading engine simulates entry, exit, spread, slippage, and fees.
4. The Outcome Evaluator creates an `OutcomeRecord`.
5. The Error Learning Agent compares the original prediction with what happened.
6. The agent creates a `LearningRecord` for mistakes, lucky wins, or validated patterns.
7. The agent may create a `StrategyChangeCandidate`.
8. The Backtesting Agent validates the candidate on historical data.
9. Approved changes are versioned and released into future paper trading.

## What Must Be Tracked

Every prediction must be linked to:

- The market snapshot visible at decision time.
- The strategy name and version.
- The model and prompt version.
- The data sources used.
- The news/calendar context.
- The source reputation context.
- The risk assessment.
- The paper order and simulated fills.
- The result and performance metrics.
- The post-trade error analysis.
- The lesson learned or reason no lesson was created.

## Error Taxonomy

Use a consistent taxonomy so repeated issues can be detected.

| Error Type | Description | Example Fix Candidate |
| --- | --- | --- |
| `bad_trend_read` | Strategy misread trend direction or strength | Add higher-timeframe confirmation |
| `false_breakout` | Entry followed a breakout that quickly failed | Require retest or volume/liquidity confirmation |
| `late_entry` | Entry occurred after most of the move was complete | Add maximum distance from trigger |
| `spread_too_high` | Costs made the setup unattractive | Tighten spread filter |
| `news_shock` | Scheduled or unscheduled news invalidated setup | Expand news block or add headline alerts |
| `stop_too_tight` | Normal volatility hit stop before thesis failed | Use volatility-adjusted stop buffer |
| `target_too_ambitious` | Target was unrealistic for regime | Cap target by nearby liquidity level |
| `wrong_regime` | Trend strategy used in range or range strategy used in trend | Improve regime classifier |
| `data_quality_issue` | Stale, missing, or anomalous data affected decision | Reject predictions with matching flags |
| `risk_rule_violation` | Prediction should have been rejected by risk controls | Add deterministic risk test |
| `lucky_win` | Trade won despite flawed process | Prevent reinforcing invalid reasoning |

## Learning Record Schema

Suggested fields:

```json
{
  "learning_id": "uuid",
  "prediction_id": "uuid",
  "created_at_utc": "timestamp",
  "strategy_name": "string",
  "strategy_version": "string",
  "symbol": "string",
  "session": "string",
  "market_regime": "string",
  "error_type": "enum",
  "severity": "low|medium|high",
  "original_reasoning_summary": "string",
  "actual_market_behavior": "string",
  "root_cause_hypothesis": "string",
  "missed_signal": "string|null",
  "false_signal": "string|null",
  "recommended_rule_change": "string|null",
  "recommended_prompt_change": "string|null",
  "requires_backtest": true,
  "approved_for_strategy_update": false
}
```

## Outcome Analysis Process

For each completed prediction, the Error Learning Agent should answer:

1. Was the prediction direction correct within the declared time horizon?
2. Did price hit stop, target, timeout, or another exit condition?
3. Was the entry aligned with the declared setup?
4. Were spread and slippage acceptable for the expected reward?
5. Did news or calendar conditions change the expected behavior?
6. Did the strategy ignore any conflicting feature?
7. Was this a true loss, a process violation, a data issue, or an acceptable probabilistic loss?
8. What should be tested before changing future behavior?

## Mistake-to-Backtest Workflow

A single mistake should not automatically change a strategy. The system should aggregate evidence.

Workflow:

1. Create a `LearningRecord` for each relevant outcome.
2. Cluster repeated mistakes by strategy, symbol, session, and regime.
3. Generate a `StrategyChangeCandidate` only when repeated evidence exists or severity is high.
4. Send the candidate to the Backtesting Agent.
5. Compare baseline and candidate performance.
6. Promote only if validation criteria are met.
7. Store rejected candidates with the reason they were rejected.

## Strategy Change Candidate Schema

Suggested fields:

```json
{
  "candidate_id": "uuid",
  "created_at_utc": "timestamp",
  "source_learning_ids": ["uuid"],
  "strategy_name": "string",
  "baseline_version": "string",
  "proposed_version": "string",
  "change_type": "rule|prompt|feature|risk_filter|retirement",
  "change_description": "string",
  "expected_effect": "string",
  "validation_plan": "string",
  "status": "pending_backtest"
}
```

## Guardrails Against Bad Learning

The learning loop should prevent the AI from overfitting or learning the wrong lesson.

Guardrails:

- Require multiple examples or a severe single failure before changing a rule.
- Separate process mistakes from statistically normal losing trades.
- Track lucky wins so bad reasoning is not rewarded.
- Validate changes on out-of-sample periods.
- Include transaction costs and spread regimes in backtests.
- Keep old strategy versions available for rollback.
- Require explicit approval before a learning recommendation changes production paper behavior.

## Metrics for Learning Quality

Track whether learning actually improves performance.

Metrics:

- Error recurrence rate by error type.
- Strategy expectancy before and after approved changes.
- Drawdown before and after approved changes.
- False-positive reduction for blocked setups.
- Number of rejected overfit candidates.
- Percentage of predictions with complete audit fields.
- Time from mistake detection to validated decision.

## Example Learning Scenario

Scenario: the Momentum Continuation Scalp repeatedly loses after London/New York overlap breakouts when spreads widen and price snaps back into the range.

Learning loop response:

1. Outcomes are tagged as `false_breakout` and `spread_too_high`.
2. The agent clusters losses by session and spread percentile.
3. It proposes a rule requiring spread to remain below a tighter threshold for several quote updates after breakout.
4. The Backtesting Agent tests the baseline against the proposed filter.
5. If drawdown improves without eliminating too many valid trades, the rule can be approved for the next paper-trading strategy version.

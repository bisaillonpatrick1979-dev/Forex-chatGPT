# Scalping Strategies

## Strategy Design Rules

Scalping strategies in this app should be treated as research hypotheses, not financial advice. Every strategy must run in paper trading first and must be validated by the Backtesting Agent before it can influence production paper decisions.

Core rules:

- Use structured inputs from the Market Watcher Agent.
- Block or reduce confidence during high-impact news windows.
- Account for spread, slippage, and latency.
- Define entry, stop, target, timeout, and invalidation conditions before simulation.
- Store a `PredictionRecord` for both trade and no-trade decisions.
- Version every strategy definition and prompt.

## Supported Instruments

Initial research targets:

- Major Forex pairs such as EUR/USD, GBP/USD, USD/JPY, USD/CAD, AUD/USD, and USD/CHF.
- Nasdaq proxy instruments such as NAS100 CFDs, Nasdaq futures, or ETF proxies depending on available data and licensing.

The app should not assume all instruments have the same spread, volatility, session behavior, or execution quality.

## Common Scalping Features

The Market Watcher Agent should compute reusable features for short-term strategies.

Feature groups:

- Trend: short EMA slope, moving-average alignment, micro higher-high/lower-low structure.
- Momentum: candle impulse size, rate of change, consecutive close direction.
- Volatility: ATR, realized volatility, range expansion, range compression.
- Liquidity and cost: spread, spread percentile, quote update frequency, candle gaps.
- Price action: wick rejection, engulfing candles, breakout retests, failed breakouts.
- Levels: session high/low, previous day high/low, VWAP where available, round numbers.
- Context: market session, minutes to news, recent news shock, source reputation context.

## Strategy 1: Momentum Continuation Scalp

Purpose: capture short bursts after price breaks from a tight range with acceptable spread and no immediate news risk.

Candidate long conditions:

- Price breaks above a short consolidation range.
- Short-term EMA slope is positive.
- Spread is below the configured percentile threshold.
- Recent candles show expanding range or increasing momentum.
- No high-impact event is inside the configured block window.

Candidate short conditions:

- Price breaks below a short consolidation range.
- Short-term EMA slope is negative.
- Spread is below the configured percentile threshold.
- Recent candles show expanding downside momentum.
- No high-impact event is inside the configured block window.

Risk template:

- Stop beyond the opposite side of the breakout range or recent swing.
- Target based on a fixed reward-to-risk ratio or nearby liquidity level.
- Timeout if price fails to move favorably within a short number of candles.

Primary failure modes:

- False breakout.
- Spread expansion after entry.
- Late entry after the move is exhausted.
- News-driven whipsaw.

## Strategy 2: Pullback-to-Trend Scalp

Purpose: join a short-term trend after a controlled pullback rather than chasing the impulse candle.

Candidate long conditions:

- Higher-timeframe micro trend is up.
- Price pulls back toward a short EMA, VWAP, or support level.
- Pullback candles show reduced momentum compared with the impulse leg.
- Rejection wick or bullish close appears near the pullback area.
- Risk-to-target remains acceptable after spread costs.

Candidate short conditions:

- Higher-timeframe micro trend is down.
- Price pulls back toward a short EMA, VWAP, or resistance level.
- Pullback candles show reduced upside momentum.
- Rejection wick or bearish close appears near the pullback area.
- Risk-to-target remains acceptable after spread costs.

Risk template:

- Stop beyond the pullback swing.
- Target at recent impulse extreme or measured move.
- Invalidate when the pullback becomes a trend reversal.

Primary failure modes:

- Misclassifying reversal as pullback.
- Entering before confirmation.
- Stop too tight for current volatility.
- Trend already overextended.

## Strategy 3: Range Reversion Scalp

Purpose: trade rejections from a well-defined intraday range when momentum is weak and spread is normal.

Candidate long conditions:

- Price reaches the lower range boundary.
- Range has multiple validated touches.
- Downside momentum weakens near support.
- Rejection wick or bullish reversal structure appears.
- No active breakout conditions are present.

Candidate short conditions:

- Price reaches the upper range boundary.
- Range has multiple validated touches.
- Upside momentum weakens near resistance.
- Rejection wick or bearish reversal structure appears.
- No active breakout conditions are present.

Risk template:

- Stop outside the range boundary with a volatility buffer.
- Target near the range midpoint or opposite boundary.
- Timeout if price stalls and spread costs dominate expected reward.

Primary failure modes:

- Trading reversion during a real breakout.
- Range boundaries drawn from too little data.
- Ignoring session transition volatility.
- Failing to adjust for news or liquidity changes.

## Strategy 4: News Avoidance and Post-News Stabilization

Purpose: avoid unpredictable news spikes and only resume trading after spreads and price behavior normalize.

This is primarily a filter strategy rather than an entry strategy.

Blocked conditions:

- High-impact event inside the pre-event block window.
- Event just released and spread remains elevated.
- Candle ranges exceed a configured volatility shock threshold.
- Provider latency or quote gaps are detected.

Resume conditions:

- Spread returns below the configured threshold.
- A minimum cooldown period has passed.
- Price forms a stable structure that another approved strategy can evaluate.
- Data quality is normal.

Primary failure modes:

- Resuming too early after a surprise release.
- Using incomplete calendar data.
- Treating unscheduled breaking news as normal volatility.

## Prediction Reasoning Template

Every strategy should emit a concise but structured reasoning summary.

Suggested fields:

- `setup_detected`
- `directional_bias`
- `supporting_features`
- `conflicting_features`
- `spread_assessment`
- `news_assessment`
- `source_reputation_assessment`
- `entry_reason`
- `stop_reason`
- `target_reason`
- `invalidation_reason`

Example summary:

```json
{
  "setup_detected": "momentum_continuation_breakout",
  "directional_bias": "long",
  "supporting_features": ["range_break", "positive_ema_slope", "normal_spread"],
  "conflicting_features": ["near_prior_session_high"],
  "spread_assessment": "acceptable",
  "news_assessment": "normal",
  "source_reputation_assessment": "no_external_signal",
  "entry_reason": "break above consolidation high with expanding candle range",
  "stop_reason": "below consolidation low plus volatility buffer",
  "target_reason": "1.5R before nearby resistance",
  "invalidation_reason": "price closes back inside range or spread widens above threshold"
}
```

## Promotion Criteria

A strategy or rule change should only be promoted after the Backtesting Agent validates it.

Minimum criteria:

- Positive expectancy after spread and slippage assumptions.
- Drawdown inside configured limits.
- Stable results across multiple date ranges.
- No obvious look-ahead bias.
- Robustness across at least several market regimes.
- Clear improvement over the prior version or a strong reason to keep it as a specialist strategy.

## Retirement Criteria

A strategy should be disabled or downgraded when:

- It repeatedly fails in the same market regime.
- Its edge disappears after realistic spread/slippage costs.
- It performs well only in one narrow overfit historical window.
- Error Learning records show unresolved process violations.
- It depends on data that is unavailable in real-time paper mode.

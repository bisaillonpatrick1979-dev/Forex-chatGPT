# Data Sources

## Data Source Principles

The app should begin with historical and delayed or demo data only. The first release must support paper trading and research workflows before any live brokerage integration. Every provider payload used by the agents should be traceable to a source, timestamp, and ingestion version.

Principles:

- Prefer replayable data snapshots for research and backtesting.
- Track provider latency, missing data, corrections, and symbol mapping differences.
- Never mix look-ahead data into backtests.
- Keep real-time demo integrations behind connector interfaces.
- Store raw payload references so predictions can be audited later.

## Required Data Categories

| Category | Purpose | Initial Source Approach | Later Source Approach |
| --- | --- | --- | --- |
| Forex candles | Strategy research and backtests | CSV/parquet imports from historical providers | OANDA demo or another broker/data API |
| Forex quotes/spreads | Scalping realism and spread filtering | Historical tick or quote files when available | OANDA demo streaming prices |
| Nasdaq candles | Nasdaq scalping research | Historical index, futures, ETF, or CFD candles | Demo market-data or broker API |
| Economic calendar | News-window blocking and macro context | Imported historical calendars | Live calendar provider |
| News headlines | Event annotation and caution flags | Curated datasets or delayed feeds | Licensed news/API feed |
| Trader/source signals | Source reputation tracking | Manually curated records | Social/news/community ingestion with review |
| Instrument metadata | Pip size, trading hours, margin assumptions | Static configuration | Provider instrument endpoint |

## Candidate Real-Time Demo Integrations

### OANDA Demo API

OANDA is a strong candidate for later Forex demo connectivity because it supports practice accounts, instrument metadata, price streams, and order endpoints. The initial integration should use it for demo or paper workflows only.

Potential use cases:

- Stream Forex prices into the Market Watcher Agent.
- Pull instrument metadata for pip precision and trade sizing.
- Compare internal paper fills against demo broker quotes.
- Eventually place demo orders after the paper engine is validated.

Implementation guidance:

- Keep credentials in environment variables or a secrets manager.
- Use separate accounts for development, testing, and demos.
- Normalize OANDA symbols into the app's canonical symbol format.
- Persist raw quote payloads or checksums for auditability.
- Treat broker availability and latency as data-quality features.

### Other Demo or Market-Data APIs

The connector layer should also be able to support alternative providers for Forex and Nasdaq instruments. Candidate categories include:

- Broker demo APIs.
- Market-data vendors with historical tick or quote data.
- Index CFD demo feeds.
- Futures data feeds for Nasdaq futures research.
- ETF data feeds for proxy testing.

Provider selection criteria:

- Historical depth at scalping timeframes.
- Bid/ask availability, not just midpoint candles.
- Clear licensing for research use.
- Stable API limits and uptime.
- Timestamp precision and timezone clarity.
- Ability to export or replay data for backtests.

## Canonical Symbol Model

Use a canonical symbol table to avoid provider-specific inconsistencies.

Suggested fields:

- `canonical_symbol`, such as `EUR_USD` or `NAS100`
- `provider_symbol`
- `provider_name`
- `asset_class`
- `base_currency`
- `quote_currency`
- `pip_location`
- `display_precision`
- `min_trade_size`
- `trading_hours`
- `timezone`
- `contract_type`
- `is_active`

## Data Quality Checks

The Market Watcher Agent should reject or flag snapshots when data quality is poor.

Checks:

- Stale quote detection.
- Missing candle detection.
- Spread widening detection.
- Outlier wick or bad tick detection.
- Duplicate timestamp detection.
- Provider disconnect detection.
- Timezone normalization validation.
- Mismatch between bid/ask and candle-derived midpoints.

Each check should emit a `DataQualityAlert` and attach flags to the relevant `MarketSnapshot`.

## Historical Data Requirements for Backtesting

Backtesting must use data that realistically represents tradable prices.

Minimum requirements:

- UTC timestamps.
- Symbol and provider identifiers.
- Open, high, low, close, and volume where available.
- Bid/ask or spread data for scalping cost modeling.
- Provider ingestion timestamp.
- Corporate action or contract rollover notes where relevant for Nasdaq proxies.

Preferred requirements:

- Tick or quote-level data for entry and stop simulation.
- Historical economic calendar events.
- Session and holiday metadata.
- Known outage or low-liquidity annotations.

## News and Calendar Data Model

Economic calendar events should be stored in a structured format.

Suggested fields:

- `event_id`
- `event_time_utc`
- `country_or_region`
- `currency_or_symbol_impact`
- `event_name`
- `impact_level`
- `actual`
- `forecast`
- `previous`
- `revision`
- `source`
- `ingested_at_utc`

The News and Economic Calendar Agent should use this data to produce symbol-level trade status values: `normal`, `caution`, or `blocked`.

## Source Reputation Data Model

External trader or analyst records should be stored separately from market data.

Suggested fields:

- `source_id`
- `source_type`
- `display_name`
- `platform`
- `claim_timestamp_utc`
- `symbol`
- `direction`
- `time_horizon`
- `claim_text_reference`
- `specificity_score`
- `historical_accuracy_score`
- `risk_disclosure_score`
- `last_evaluated_at_utc`

Source reputation data should never be treated as ground truth. It is contextual evidence only.

## Storage and Retention

Recommended storage layout:

- Raw provider payloads in object storage by provider, symbol, and date.
- Normalized candles and quotes in partitioned database tables.
- Market snapshots linked to raw data references.
- Prediction and outcome records in relational tables.
- Backtest artifacts with immutable run IDs.

Retention policy:

- Keep prediction, outcome, and learning records indefinitely for auditability.
- Keep raw high-frequency data according to storage cost and provider licensing.
- Keep backtest data snapshots immutable once used in a published report.

# Options Edge Finder -> Institutional-Grade Quant Platform

**Status:** Vision Spec
**Current State:** Streamlit app (streamlit_app.py, 2,990 lines) + monolithic analytics.py (1,426 lines), 8 eval modules, daily batch sampler via GitHub Actions, Supabase/Postgres backend, ~350 liquid tickers sampled daily
**Target State:** Next.js 15+ frontend (House Design Language) + FastAPI compute backend, with backtesting engine, strategy factory, Monte Carlo portfolio simulation, and trade journal with P&L attribution

---

## 1. The Job This Product Does

**The user:** A retail options seller with enough knowledge to be dangerous. They understand implied volatility, know what a strangle is, and have read enough to know that selling premium "works most of the time." They have a $50K-$500K account. They are not a quant, but they want to trade like one.

**The struggling moment:** They open their broker at 9:45 AM. They know they want to sell premium because IV "seems high." But high compared to what? They check Barchart for IV rank, open Market Chameleon for the vol surface, pull up a spreadsheet where they track past trades manually, and scan TastyTrade for ideas. Three tabs, two spreadsheets, zero systematic methodology. They sell a strangle on TSLA because "IV rank is 80%" without knowing whether that edge is real, how it performed historically, or whether their portfolio is now 60% correlated tech-vol exposure.

**Compensating behaviors they do today:**
- Check 3+ free screeners (Barchart, Market Chameleon, OptionStrat) but none provide independent vol forecasts — they all just show the market's IV back to you
- Run spreadsheets to track P&L, but can't attribute results to signal components (was it the VRP that worked, or the IV rank filter, or just luck?)
- Follow tips from Discord/Twitter without methodology — "NVDA puts look juicy" with no walk-forward evidence
- Sell premium based on "IV is high" without an independent forecast of realized vol to compare against
- Treat portfolio as a collection of independent trades when it's actually one big bet on low-vol continuation
- Have no circuit breakers — they keep selling through regime changes until a blowup teaches them

**The job:** Help me see which options are genuinely mispriced — not just "high IV" — by converging multiple independent vol models, then tell me exactly what to trade, how much, and when to get out, with historical evidence that the specific signal combination works out-of-sample.

---

## 2. What Right Looks Like

### Single Decision Surface: The Signal Dashboard

The user opens one page and sees today's top edges across 350 tickers, ranked by `edge_magnitude * confidence_score`. Each row shows:

- **Ticker** with current price and 1-day change
- **Edge Score** (composite of VRP, GARCH divergence, term structure signal, skew z-score)
- **Confidence** (how many independent models agree, regime-adjusted)
- **Suggested Strategy** (iron condor, strangle, credit spread — determined by signal profile)
- **Walk-Forward Win Rate** for this signal combination over the past 5 years
- **Kelly-Optimal Size** (25% conservative Kelly fraction)
- **Risk Flags** (earnings within 14 days, FOMC within 7 days, backwardation, circuit breaker warnings)

This is the `/picks` equivalent. One surface. Every number has a methodology behind it.

### Architecture: Separate Compute from Presentation

**Frontend:** Next.js 15+ with the House Design Language — OKLch color tokens, shadcn/ui components (`base-nova` style), Geist Sans/Mono fonts. Pages for: Signals, Backtester, Portfolio, Journal, Risk.

**Backend:** FastAPI with async workers. All heavy math lives here — GARCH fitting, Monte Carlo simulation, walk-forward backtesting. The frontend never touches NumPy. Communication is JSON over REST, with WebSocket channels for real-time signal updates during market hours.

**Database:** Supabase Postgres (preserving all existing IV snapshot data — this is months of daily samples that cannot be recreated). Redis for real-time signal cache and pub/sub for live updates.

**Compute stack:** NumPy, SciPy, pandas for core math. `arch` library for GARCH. `py_vollib` for Black-Scholes Greeks. All existing models (Yang-Zhang, Parkinson, GARCH(1,1,1) with GJR, VRP, Kelly, Monte Carlo, CUSUM, circuit breakers) are preserved and decomposed into independent, testable modules.

### Key Architectural Decisions

1. **Strategy as code.** Every strategy is a Python class with a defined interface: `parameters`, `entry_rules()`, `exit_rules()`, `position_size()`. Strategies are versioned, parameterized, and composable. No strategy lives as ad-hoc logic buried in a 2,990-line Streamlit file.

2. **Walk-forward everything.** No performance number is ever shown from in-sample testing. Every metric the user sees comes from out-of-sample walk-forward validation. The existing `walk_forward_backtest()` in eval_backtest.py (train=756d, test=126d, step=63d) becomes the foundation, extended to support arbitrary strategy/signal combinations.

3. **Trade attribution.** Every trade is tagged with which signal components triggered it and their values at entry. When P&L is realized, attribution analysis decomposes: how much of the return came from VRP being positive? From the IV rank filter? From the regime filter? This is how you know which parts of the methodology actually work vs. which are noise.

4. **Portfolio-level risk.** Never show trade-level metrics without portfolio context. The existing `crisis_correlation_analysis()` and `portfolio_vega_stress()` from eval_portfolio.py become first-class features, not buried eval modules.

---

## 3. What Wrong Looks Like

**Wrong: In-sample backtesting.** Optimize parameters on the same data you test on. Every strategy looks amazing in backtest, fails live. This is the single most common quant mistake. The current codebase already has walk-forward validation in eval_backtest.py — the new system must enforce it as the only path. No in-sample equity curves are ever displayed to the user without an OOS comparison alongside.

**Wrong: Overfitting the strategy factory.** 50 parameters x 350 tickers x 5 years = you can find "edge" anywhere. This is the multiple comparisons problem. If you test 1,000 strategy variants, 50 will show p < 0.05 by pure chance. Mitigations: (a) Benjamini-Hochberg FDR correction on all strategy-level significance tests, (b) economic significance threshold — minimum $0.50/contract expected profit after all costs, (c) Deflated Sharpe Ratio (the existing eval_signals.py already references this concept), (d) minimum 200 OOS trades before any strategy is shown as "validated."

**Wrong: Beautiful UI, no edge.** Gorgeous charts showing IV percentile and Greeks but the user still can't answer "should I trade this or not?" The decision must be explicit: GREEN (trade it, here's the size), YELLOW (edge exists but below threshold), RED (no edge or active circuit breaker). The current traffic-light system in the Streamlit app works — preserve it, refine it.

**Wrong: Ignoring transaction costs.** The current backtest already models commissions ($0.65/contract) and slippage ($0.025/contract). The new system must go further: estimate bid-ask spread from option chain data (midpoint vs. natural price), model slippage as a function of volume/open interest, and penalize illiquid strikes. A backtest showing 60% win rate that becomes 48% after realistic costs is worse than useless — it's misleading.

**Wrong: Portfolio as collection of trades.** Selling strangles on AAPL, MSFT, NVDA, GOOGL, and META is not five independent trades. It's one concentrated bet on tech volatility staying low. The existing crisis_correlation_analysis() already computes N_eff (effective independent bets) using the formula `N / (1 + (N-1) * avg_corr)`. This must be surfaced prominently. If your 10-position portfolio has N_eff = 2.3, you need to know that before sizing.

**Wrong: No regime awareness.** A strategy that prints money in low-vol trending markets (2017, 2019, 2021) can blow up in regime change (Feb 2018 volmageddon, March 2020 COVID, 2022 rate shock). The existing `classify_vol_regime()` and `check_circuit_breakers()` must gate every signal. If the regime detector says "crisis" or "high-vol," the system automatically reduces position sizes or halts new entries — not as a suggestion, as a hard constraint.

**Wrong: Streamlit with lipstick.** Just porting the 2,990-line streamlit_app.py to Next.js without rearchitecting. The monolithic analytics.py (1,426 lines containing 30+ functions from vol estimation to Monte Carlo to trade scoring) must be decomposed into independent modules with clean interfaces. The current eval_*.py modules (eval_risk, eval_backtest, eval_signals, eval_portfolio, eval_monitor) are already partially decomposed — that pattern must be completed.

---

## 4. Architecture

### System Diagram

```
Browser (Next.js 15+)
  |
  |-- REST/WebSocket --> FastAPI Gateway
  |                        |
  |                        |-- Signal Engine (async workers)
  |                        |     - VRP Calculator
  |                        |     - GARCH Forecaster
  |                        |     - Term Structure Analyzer
  |                        |     - Skew Scorer
  |                        |     - Regime Classifier
  |                        |     - Circuit Breaker Monitor
  |                        |
  |                        |-- Backtest Engine (async workers)
  |                        |     - Walk-Forward Harness
  |                        |     - Strategy Runner
  |                        |     - Cost Model
  |                        |     - Statistical Tests
  |                        |
  |                        |-- Portfolio Engine
  |                        |     - Monte Carlo Simulator
  |                        |     - Correlation Matrix
  |                        |     - Greeks Aggregator
  |                        |     - Stress Tester
  |                        |
  |                        |-- Trade Journal
  |                              - Trade Logger
  |                              - Attribution Engine
  |                              - P&L Calculator
  |
  Supabase Postgres              Redis
  (IV snapshots, trades,         (signal cache, real-time
   backtest results,              updates, job queue)
   journal entries)
  |
  Data Pipeline
  (batch_sampler.py -> enhanced with streaming during market hours)
  (yf_proxy.py via Cloudflare Worker -> Yahoo Finance)
```

### Frontend Pages

| Page | Purpose | Key Components |
|------|---------|----------------|
| `/signals` | Today's edges, ranked | Signal table, edge score breakdown, strategy suggestion per ticker |
| `/ticker/[symbol]` | Deep-dive on one ticker | Vol surface, term structure chart, GARCH forecast vs IV, historical VRP, Greeks chain |
| `/backtest` | Strategy validation | Walk-forward config, equity curve, OOS metrics, parameter sensitivity heatmap |
| `/portfolio` | Current positions + risk | Aggregate Greeks, correlation heatmap, N_eff, Monte Carlo fan chart, stress scenarios |
| `/journal` | Trade log + attribution | Trade table with signal tags, P&L attribution waterfall, cumulative equity curve |
| `/risk` | Portfolio risk dashboard | VaR/CVaR, max drawdown tracker, CUSUM chart, circuit breaker status |

### Database Schema (Extending Existing)

The existing `iv_snapshots` table (ticker, date, atm_iv, spot_price, rv_20, term_label, put_25d_iv, call_25d_iv, rv_10, rv_30, rv_60, yz_20, garch_vol) is preserved as-is. New tables:

```sql
-- Strategy definitions (versioned)
CREATE TABLE strategies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  version INT NOT NULL,
  type TEXT NOT NULL,           -- 'iron_condor', 'strangle', 'credit_spread', etc.
  parameters JSONB NOT NULL,    -- {delta_short: 0.16, dte_target: 45, ...}
  entry_rules JSONB NOT NULL,   -- [{signal: 'vrp', operator: '>', threshold: 3}, ...]
  exit_rules JSONB NOT NULL,    -- [{type: 'profit_target', value: 0.50}, ...]
  sizing_method TEXT NOT NULL,  -- 'kelly_25', 'fixed_risk', 'vol_scaled'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, version)
);

-- Backtest results (immutable, one row per walk-forward run)
CREATE TABLE backtest_runs (
  id UUID PRIMARY KEY,
  strategy_id UUID REFERENCES strategies(id),
  ticker TEXT,                   -- NULL = universe-wide
  train_days INT,
  test_days INT,
  step_days INT,
  cost_model JSONB,
  oos_sharpe REAL,
  oos_win_rate REAL,
  oos_profit_factor REAL,
  oos_max_drawdown REAL,
  oos_n_trades INT,
  fdr_adjusted_pvalue REAL,     -- multiple comparison corrected
  window_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trade journal
CREATE TABLE trades (
  id UUID PRIMARY KEY,
  strategy_id UUID REFERENCES strategies(id),
  ticker TEXT NOT NULL,
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  type TEXT NOT NULL,            -- 'short_strangle', 'iron_condor', etc.
  legs JSONB NOT NULL,           -- [{side: 'put', strike: 150, exp: '2026-04-17', qty: -1}, ...]
  entry_signals JSONB NOT NULL,  -- {vrp: 5.2, iv_rank: 72, garch_div: 3.1, regime: 'low_vol'}
  entry_price REAL NOT NULL,     -- net credit received
  exit_price REAL,               -- net debit paid to close
  pnl REAL,                      -- realized P&L in dollars
  pnl_pct REAL,                  -- P&L as % of margin/risk
  fees REAL,                     -- total commissions + estimated slippage
  notes TEXT
);

-- P&L attribution per trade
CREATE TABLE trade_attribution (
  id UUID PRIMARY KEY,
  trade_id UUID REFERENCES trades(id),
  component TEXT NOT NULL,       -- 'vrp_signal', 'iv_rank_filter', 'regime_filter', 'exit_rule', 'cost_drag'
  contribution REAL NOT NULL,    -- estimated P&L contribution in dollars
  methodology TEXT               -- how this attribution was computed
);

-- Real-time signal cache (also in Redis, persisted here for history)
CREATE TABLE daily_signals (
  ticker TEXT NOT NULL,
  date DATE NOT NULL,
  edge_score REAL,
  confidence REAL,
  vrp REAL,
  garch_forecast REAL,
  iv_rank REAL,
  iv_pctl REAL,
  term_slope REAL,
  skew_zscore REAL,
  regime TEXT,
  suggested_strategy TEXT,
  circuit_breaker_active BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (ticker, date)
);
```

---

## 5. The Backtesting Engine in Detail

### Strategy Interface

Every strategy implements this contract:

```python
class Strategy(Protocol):
    name: str
    version: int
    parameters: dict

    def should_enter(self, signals: SignalSnapshot, portfolio: PortfolioState) -> Optional[TradeSpec]:
        """Return a TradeSpec if entry conditions are met, None otherwise."""

    def should_exit(self, position: Position, current: MarketSnapshot) -> Optional[ExitReason]:
        """Return ExitReason if exit conditions are met, None otherwise."""

    def position_size(self, signals: SignalSnapshot, account: AccountState) -> float:
        """Return fraction of account to allocate (0.0 to 1.0)."""
```

### Signal Interface

```python
@dataclass
class SignalSnapshot:
    ticker: str
    date: date
    vrp: float              # IV - realized vol
    iv_rank: float          # 0-100 percentile in 52-week range
    iv_pctl: float          # % of days IV was lower
    garch_forecast: float   # GARCH(1,1,1) with GJR term, annualized
    garch_divergence: float # garch_forecast - current_iv (negative = IV overpriced)
    term_slope: float       # front IV - back IV (positive = backwardation)
    skew_zscore: float      # put-call skew relative to history
    regime: str             # 'low_vol', 'normal', 'high_vol', 'crisis'
    yang_zhang_vol: float   # OHLC-based realized vol
    parkinson_vol: float    # high-low range vol
    days_to_earnings: Optional[int]
    days_to_fomc: Optional[int]
```

### Walk-Forward Protocol

Building on the existing `walk_forward_backtest()` from eval_backtest.py:

1. **Data preparation.** Fetch OHLCV + IV snapshots for the ticker over the full available history. Compute all signal components (VRP, GARCH forecast, IV rank from stored snapshots, term structure, skew).

2. **Window configuration.** Default: train=756 trading days (3 years), test=126 days (6 months), step=63 days (quarterly roll). These defaults come from the existing implementation and are reasonable for options strategies where cycles matter.

3. **Training phase.** On each training window: fit GARCH parameters, establish IV percentile thresholds, calibrate signal weights. The key output is a frozen `SignalConfig` — the thresholds and parameters that will be applied out-of-sample.

4. **Testing phase.** Apply the frozen `SignalConfig` to the test window. Generate trades using the strategy's entry/exit rules with training-period parameters. Record every trade with full signal metadata.

5. **Slide and repeat.** Step forward by `step_days`, re-train, re-test. Continue until data is exhausted.

6. **Aggregation.** Concatenate all OOS trade results. Compute:
   - **Sharpe ratio** (annualized, OOS only)
   - **Sortino ratio** (downside deviation only)
   - **Max drawdown** (peak-to-trough, using existing `calc_max_drawdown()`)
   - **Win rate** (% of trades with positive P&L)
   - **Profit factor** (gross profit / gross loss)
   - **Average trade** (mean P&L per trade in dollars and %)
   - **CVaR 95%** (expected loss in worst 5% of trades, using existing `calc_cvar()`)
   - **Omega ratio** (using existing `calc_omega_ratio()`)

7. **Statistical significance.** For each strategy variant tested:
   - t-test: is mean OOS P&L significantly different from zero?
   - Deflated Sharpe Ratio: adjust for multiple testing (how many strategy variants were tried?)
   - Benjamini-Hochberg FDR correction across all variants
   - Minimum 200 OOS trades before declaring significance

### Cost Model

```python
@dataclass
class CostModel:
    commission_per_contract: float = 0.65    # typical retail
    exchange_fee: float = 0.05               # per contract
    slippage_model: str = 'volume_based'     # or 'fixed', 'spread_based'
    fixed_slippage: float = 0.025            # per contract if fixed
    spread_pct_of_mid: float = 0.05          # estimated for spread_based
    min_open_interest: int = 100             # skip illiquid strikes
    min_volume: int = 50                     # skip untradeable strikes
```

The existing eval_backtest.py uses commission=0.65 and slippage=0.025 as defaults. The new system adds spread-based slippage estimation using option chain data (bid-ask width as a function of moneyness and DTE), and filters out strikes below minimum liquidity thresholds.

### Output

For every backtest run, the user sees:
- **Equity curve** (OOS only, with drawdown overlay)
- **Trade log** (every OOS trade with entry/exit dates, signal values, P&L)
- **Parameter sensitivity heatmap** (how robust is the edge to parameter perturbation?)
- **Regime-conditional performance** (how did this strategy do in low-vol vs. high-vol vs. crisis?)
- **IS vs. OOS comparison** (if IS Sharpe = 2.0 and OOS Sharpe = 0.3, the strategy is overfit)
- **Statistical significance badge** (FDR-adjusted p-value, Deflated Sharpe)

---

## 6. The Strategy Factory

### Base Strategy Types

| Strategy | Parameters | When It Works |
|----------|-----------|---------------|
| **Short Strangle** | delta_short, dte_target, profit_target, stop_loss | High IV rank, positive VRP, low skew, range-bound |
| **Iron Condor** | delta_short, wing_width, dte_target, profit_target | Same as strangle but defined risk — for smaller accounts |
| **Credit Spread (Put)** | delta_short, width, dte_target | Bullish bias + positive VRP |
| **Credit Spread (Call)** | delta_short, width, dte_target | Bearish bias + positive VRP (rare) |
| **Calendar Spread** | strike_pct, front_dte, back_dte | Term structure in contango, expecting near-term vol to drop |
| **Diagonal Spread** | front_delta, back_delta, front_dte, back_dte | Directional bias + term structure view |
| **Ratio Spread** | long_qty, short_qty, delta_long, delta_short | Skew play — when put skew is extreme |

### Signal Triggers

Each strategy has configurable entry conditions as AND/OR logic over signal components:

```python
entry_rules = [
    {"signal": "vrp", "operator": ">", "threshold": 3.0},           # VRP > 3 vol points
    {"signal": "iv_rank", "operator": ">", "threshold": 30.0},      # IV rank above 30th pctl
    {"signal": "regime", "operator": "in", "values": ["low_vol", "normal"]},
    {"signal": "days_to_earnings", "operator": ">", "threshold": 14},
    {"signal": "garch_divergence", "operator": "<", "threshold": -2.0},  # GARCH says IV is overpriced
    {"signal": "term_slope", "operator": "<", "threshold": 0.0},    # contango (no backwardation)
]
```

The power is in convergence: a strangle triggered only when VRP > 3 AND iv_rank > 30 AND GARCH agrees AND no earnings AND no backwardation is a much higher-confidence trade than "IV rank is high."

### Position Sizing

Three modes:

1. **Kelly 25%** (conservative quarter-Kelly): `f = 0.25 * (p * b - q) / b` where p = win probability from walk-forward backtest, b = avg win/avg loss ratio, q = 1-p. This is what the current `calc_kelly_size()` in analytics.py implements.

2. **Fixed risk %**: Risk no more than X% of account on any single trade. For defined-risk strategies (iron condors, spreads), risk = max loss. For undefined-risk (strangles), risk = margin requirement.

3. **Volatility-scaled**: Size inversely proportional to current realized vol. In high-vol regimes, reduce size. In low-vol regimes, standard size. Scaling factor: `base_size * (target_vol / current_vol)`.

### Exit Rules

```python
exit_rules = [
    {"type": "profit_target", "value": 0.50},      # Close at 50% of max profit
    {"type": "stop_loss", "value": 2.0},            # Close if loss > 2x credit received
    {"type": "dte_target", "value": 21},             # Close at 21 DTE (avoid gamma risk)
    {"type": "delta_breach", "value": 0.30},         # Close if short delta > 0.30
    {"type": "circuit_breaker", "trigger": "vix_spike"},  # Close if VIX > 30
]
```

The existing `generate_exit_signals()` and `get_action_playbook()` from analytics.py implement several of these — they are preserved and formalized into the rule interface.

### Composability

Strategies compose into a portfolio with constraints:

- **Max correlation**: no new position if adding it would push portfolio avg correlation above 0.6
- **Max sector exposure**: no more than 30% of risk in any one sector
- **Max vega exposure**: total portfolio vega bounded by `account_size * max_vega_pct`
- **Regime scaling**: all sizes reduced by 50% in high-vol regime, halted in crisis regime

---

## 7. What Makes This Defensible

**Multi-model convergence.** Free screeners show you IV rank. This platform shows you IV rank, GARCH forecast divergence, VRP, term structure signal, and skew z-score — and only triggers when they agree. The convergence of independent models IS the insight. A single model can be wrong. Five independent models agreeing is a much stronger signal.

**Walk-forward validated backtests.** Most retail platforms (and many institutional ones) show in-sample backtests. Users see beautiful equity curves that evaporate in live trading. Every number in this platform comes from OOS walk-forward validation with statistical significance testing and FDR correction. This is the standard institutional quant shops use — almost nobody in the retail space does it.

**Trade attribution.** After 100 trades, the system can tell you: "VRP signal contributed +$4,200, IV rank filter contributed +$1,800, regime filter saved you -$3,100 by keeping you out of the March crash, and transaction costs dragged -$650." This is how you know what works and what's noise. No retail platform does this.

**Portfolio-level risk with crisis correlations.** The existing eval_portfolio.py already computes normal vs. crisis correlations and N_eff. In crisis, correlations spike to 0.8+ across sectors. A portfolio of 10 "independent" strangles becomes ~2 independent bets. Surfacing this is the difference between confident sizing and blowup risk.

**Regime-aware circuit breakers.** The existing eval_monitor.py has CUSUM edge erosion detection and circuit breakers (VIX thresholds, drawdown limits, calendar exclusions). These become hard constraints in the new system, not optional checks.

---

## 8. Phases

### Phase 1: Rewrite to Next.js + FastAPI (8-10 weeks)

- Decompose analytics.py into independent modules: `vol_models.py`, `signal_engine.py`, `greeks.py`, `trade_scorer.py`, `monte_carlo.py`
- Build FastAPI backend with endpoints for: `/signals/{ticker}`, `/signals/top`, `/chain/{ticker}`, `/vol-surface/{ticker}`
- Build Next.js frontend with Signal Dashboard page and Ticker Deep-Dive page
- Preserve all existing Supabase data and batch_sampler.py pipeline
- Migrate existing trade log from SQLite to Supabase
- Feature parity with current Streamlit app before moving forward

**Exit criteria:** Every feature in the current Streamlit app works in the new stack. Side-by-side comparison confirms identical signal values for the same ticker on the same day.

### Phase 2: Backtesting Engine (6-8 weeks)

- Formalize Strategy and Signal interfaces as Python protocols
- Extend existing `walk_forward_backtest()` to support arbitrary strategy types
- Build cost model with spread-based slippage estimation
- Implement Deflated Sharpe Ratio and Benjamini-Hochberg FDR correction
- Build backtest results page: equity curve, trade log, parameter sensitivity, regime breakdown
- Store all backtest results in Postgres for comparison

**Exit criteria:** Run walk-forward backtest on short strangle strategy across 10 representative tickers. OOS results match or improve on existing eval_backtest.py output. Statistical significance testing correctly identifies overfit variants.

### Phase 3: Strategy Factory + Portfolio Simulator (6-8 weeks)

- Implement all 7 base strategy types with parameterized entry/exit rules
- Build strategy editor UI (configure parameters, entry rules, exit rules, sizing)
- Implement Monte Carlo portfolio simulator: 10,000 paths, 30/60/90 day horizons, correlated vol shocks using Cholesky decomposition, fat tails via Student-t innovations, regime switching via hidden Markov model
- Build portfolio page: aggregate Greeks, correlation heatmap, Monte Carlo fan chart, stress scenarios (COVID March 2020, Volmageddon Feb 2018, Rate Shock 2022, Yen Carry Unwind Aug 2024)
- Implement portfolio composition constraints (max correlation, max sector exposure, max vega)

**Exit criteria:** User can define a custom strategy, backtest it walk-forward, add positions to a portfolio, and see Monte Carlo projections with stress scenarios. Correlation constraints prevent concentrated bets.

### Phase 4: Trade Journal with Attribution (4-6 weeks)

- Build trade logging UI (manual entry + broker CSV import for TastyTrade, IBKR, Schwab formats)
- Implement attribution engine: decompose each trade's P&L into signal component contributions
- Build journal page: trade table, attribution waterfall charts, cumulative equity curve, per-strategy performance breakdown
- Implement prediction scorecard (extending existing `log_prediction` / `score_pending_predictions` from db.py)

**Exit criteria:** 30+ historical trades logged with full attribution. Attribution correctly identifies which signal components drove positive vs. negative P&L.

### Phase 5: Real-Time Pipeline + Alerts (4-6 weeks)

- Replace daily-only batch_sampler.py with hybrid: streaming during market hours (9:30 AM - 4:00 PM ET, 5-minute intervals for top 50 tickers), daily batch for full universe
- Implement WebSocket channels for live signal updates on the dashboard
- Build alert system: push notifications when edge exceeds threshold on a watchlist ticker
- Add FOMC calendar integration and earnings calendar auto-exclusion
- Implement real-time circuit breaker monitoring with automatic position flags

**Exit criteria:** Signals update within 5 minutes of market data change during trading hours. Alerts fire within 1 minute of threshold breach. Circuit breakers activate correctly on simulated VIX spike.

---

## 9. Risks and Mitigations

### Data Quality

**Risk:** Yahoo Finance (via yf_proxy.py Cloudflare Worker) is the sole data source. Yahoo IV data is approximate (not exchange-level), can have gaps, and the API is unofficial.

**Mitigation:** The existing 90-day bootstrap in batch_sampler.py already handles cold-start. Add data quality checks: flag tickers with stale IV (>24h old), cross-validate IV against Black-Scholes implied from last trade price, maintain fallback to computed IV from option chain mid prices. Long-term: evaluate CBOE data feeds or Polygon.io options data as a paid upgrade path (cost conversation required before commitment).

### Compute Costs

**Risk:** Monte Carlo with 10K paths across a 20-position portfolio with correlated vol shocks is computationally expensive. Walk-forward backtesting across 350 tickers x 7 strategy types is hours of compute.

**Mitigation:** Backtests are batch jobs, not real-time. Run overnight, cache results. Monte Carlo uses vectorized NumPy (not Python loops) — 10K paths for a 20-position portfolio takes ~2 seconds on modern hardware. Signal computation for the daily batch is already <30 minutes for 350 tickers. FastAPI workers can be horizontally scaled if needed.

### Overfitting Risk

**Risk:** The strategy factory makes it easy to find "edges" that are statistical noise.

**Mitigation:** FDR correction is mandatory. Minimum 200 OOS trades. Deflated Sharpe Ratio. Economic significance threshold ($0.50/contract minimum expected profit). IS vs. OOS comparison prominently displayed — if IS Sharpe is 3x OOS Sharpe, the system flags it as likely overfit. Parameter sensitivity analysis: if changing delta_short from 0.16 to 0.18 halves the Sharpe, the edge is fragile.

### User Trust in Signals

**Risk:** User follows a GREEN signal, takes a loss, loses confidence in the system.

**Mitigation:** Every signal shows its walk-forward win rate and expected loss in worst 5% of trades (CVaR). The system explicitly says: "This signal combination wins 68% of the time OOS with avg profit of $1.20/contract and worst-5% loss of $3.40/contract." Losses are expected and sized for. The journal tracks whether following the signals produces positive expectancy over 50+ trades — which is the only timeframe that matters.

### Regulatory Considerations

**Risk:** Showing "suggested trades" could be construed as investment advice.

**Mitigation:** Clear disclaimers: "Educational and analytical tool. Not investment advice. Past backtest performance does not guarantee future results. All metrics are based on historical data with model assumptions that may not hold in future market conditions." The system shows methodology and evidence, not recommendations.

---

## 10. Success Metrics

### Trade-Level (measured after 100+ OOS predictions)

- **Signal accuracy:** GREEN signals produce positive P&L > 60% of the time OOS (current VRP baseline: ~82% for indices, lower for single stocks)
- **Edge magnitude:** Average GREEN trade P&L > $0.50/contract after all costs
- **CVaR ratio:** Cumulative premium collected / CVaR 95% > 3.0 (you keep more than your tail risk)
- **Signal calibration:** Predicted win probability within 5 percentage points of actual win rate

### Portfolio-Level (measured over 6+ month live trading)

- **Sharpe ratio > 1.0** after all costs (annualized, on OOS walk-forward)
- **Max drawdown < 15%** of account value
- **Recovery time < 60 trading days** from any drawdown
- **Regime performance:** Positive P&L in at least 3 of 4 regime types (low-vol, normal, high-vol; acceptable to lose in crisis if losses are bounded)

### User-Level (measured by behavior)

- **Decision time:** User goes from "open app" to "know what to trade" in < 5 minutes (vs. 30+ minutes across 3 screeners today)
- **Attribution insight:** After 50 trades, user can identify which signal components are working for their portfolio and which are not
- **Risk awareness:** User never has a portfolio with N_eff < 2 without explicitly acknowledging the concentration risk
- **Journal consistency:** > 80% of trades logged with complete signal metadata (enables attribution)

### System-Level

- **Signal latency:** < 5 minutes from market data to updated signal during trading hours
- **Backtest throughput:** Full walk-forward for one strategy x one ticker in < 30 seconds
- **Data coverage:** IV snapshots for 350+ tickers with < 2% missing days per ticker per month
- **Uptime:** Dashboard available 99.5% during market hours (9:30 AM - 4:00 PM ET)

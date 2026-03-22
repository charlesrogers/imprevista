# GunDealAlerts -> Universal Deal Intelligence Engine

**Status:** Vision Spec
**Current State:** Flask + MongoDB on Heroku, PRAW/Arctic Shift scraping pipeline fetching ~1000 posts/minute from r/gundeals, regex-based price extraction, hardcoded product fingerprinting, composite engagement scoring (upvotes + 1.2 * comments) with statistical breakout detection, Mailgun email + Tweepy X/Twitter notification pipeline, Pillow image generation at 2x resolution
**Target State:** ML-powered NLP entity extraction, per-product-family price intelligence with percentile scoring, engagement velocity modeling with sell-out prediction, Reddit-specific sentiment analysis, cross-marketplace arbitrage detection, Next.js 15+ frontend (House Design Language), personalized deal recommendations

---

## 1. The Job This Product Does

**The user:** A firearms enthusiast who buys 3-15 guns/optics/accessories per year. They know what they want — or at least what category they want. They are not browsing for fun. They are hunting for value: the moment a specific product drops below their mental price threshold, they want to know immediately and act before it sells out.

**The struggling moment:** They open Reddit at 7 AM. r/gundeals has 47 new posts since they last checked. They scan titles, mentally parsing "PSA Dagger Full Size 9mm 4.49in Threaded Barrel, Black - $299.99" into manufacturer + model + price, then comparing that price against a mental database of "what this normally goes for" built from months of lurking. They click through three posts, realize two are mediocre and one is already OOS. They do this 4-8 times per day. They have no systematic way to know whether $299 for a PSA Dagger is good, great, or average. They bought a Glock 19 for $489 last month because "it might sell out" — it didn't, and it was posted for $449 two weeks later.

**Compensating behaviors they do today:**
- Refresh r/gundeals 4-8 times per day, scanning 30-50 titles per session, processing each one mentally for product + price + "is this good?"
- Maintain a mental price database — "Glock 19 Gen 5 is usually $500-530, anything under $470 is good, under $450 is buy-it-now"
- Read comment sections to gauge deal quality — looking for "BIN" (buy it now), "this is it chief," or "meh, was $20 cheaper last month"
- Open the retailer link, check if it's in stock, calculate landed cost (price + shipping + FFL transfer fee + tax) mentally
- FOMO-purchase because they can't verify whether the price is actually good or just "seems good" compared to recent memory
- Set up keyword alerts on multiple platforms but still miss time-sensitive deals that sell out in 30 minutes
- Cross-reference prices across PSA, Brownells, Midway USA, Primary Arms manually when they see a deal

**The job:** Help me instantly know whether a deal is actually good — not just popular — by telling me where this price sits in the historical distribution for this exact product, how fast it's likely to sell out, and whether I can get it cheaper elsewhere. Eliminate the mental price database. Eliminate the FOMO purchases. Turn "I think this is a good deal" into "this is the 12th percentile price for this product in the last 12 months."

---

## 2. What Right Looks Like

### The Transformed Deal Alert

Today's alert: "Hot Deal: PSA Dagger Full Size 9mm 4.49" Threaded Barrel, Black - $299.99. Composite score 847."

Tomorrow's alert: "PSA Dagger Full Size 9mm TB — $299.99. This is the 8th percentile price (posted 34 times in 14 months, best-ever $279, median $339). Engagement velocity: 62 upvotes in 12 minutes — 91% chance of selling out within 3 hours. Comments: 14/16 positive, 3 verified knowledgeable commenters say BIN. Landed cost with avg shipping + FFL: ~$340. Same gun is $379 at Palmetto direct, $399 at Brownells. Verdict: genuine deal, act fast."

Every number in that alert is backed by a specific pipeline. Nothing is hallucinated. Nothing is vibes.

### NLP Entity Extraction

A Reddit title like `[Handgun] PSA Dagger Full Size 9mm 4.49" Threaded Barrel, Black - $299.99 + S/H` becomes a structured entity:

```json
{
  "category": "Handgun",
  "manufacturer": "Palmetto State Armory",
  "model": "Dagger",
  "variant": "Full Size",
  "caliber": "9mm",
  "barrel_length": 4.49,
  "barrel_type": "Threaded",
  "color": "Black",
  "condition": "New",
  "price": 299.99,
  "shipping_note": "plus S/H",
  "product_family": "psa-dagger-full-size-9mm",
  "confidence": {
    "manufacturer": 0.99,
    "model": 0.98,
    "caliber": 0.99,
    "barrel_length": 0.95,
    "condition": 0.85
  }
}
```

The confidence scores matter. "Condition: New" with 0.85 confidence means the title didn't explicitly say "new" but nothing indicated used/blem/surplus — so we infer new as the default but flag the uncertainty.

### Price Intelligence Per Product Family

Every resolved product entity maps to a product family. Each family accumulates a price history:

- **Percentile ranking:** Where does today's price sit in the 12-month distribution? 8th percentile = cheaper than 92% of historical postings.
- **Trend line:** Is this product getting cheaper (oversupply, new model coming) or more expensive (election year, supply crunch)?
- **Seasonal patterns:** Black Friday (15-25% discounts typical), July 4th sales, election year spikes (+10-20% for certain categories).
- **Best-ever and worst-ever prices** with dates, so users can calibrate expectations.
- **Deal Quality Score:** `price_percentile * 0.5 + engagement_signal * 0.3 + freshness * 0.2` — a single number that synthesizes price history + community validation + deal recency.

### Sell-Out Prediction

Not all hot deals sell out. A $299 PSA Dagger will last hours. A $389 Glock 19 Gen 5 will sell out in 20 minutes. The difference is predictable from early engagement patterns.

Features for the sell-out model:
- Upvote velocity (upvotes per minute in first 10 minutes)
- Comment velocity (comments per minute in first 10 minutes)
- Price percentile (lower = faster sell-out)
- Product family popularity (how often this family is posted and engaged with)
- Day of week and time of day (weekday mornings sell faster)
- Retailer (some retailers have less inventory)
- OOS flag velocity (how fast does the `spoiler` tag get applied?)

Output: calibrated probability of sell-out within 1 hour, 3 hours, 12 hours. Calibrated means: when the model says 78%, deals actually sell out 78% of the time.

### Sentiment Analysis on Comments

The r/gundeals comment section is the most valuable signal the current system ignores. Comments contain:
- **Price validation:** "Was $20 cheaper last month" or "this is the lowest I've ever seen it"
- **Product quality signal:** "I have two of these, great guns" or "avoid, known extractor issues on early runs"
- **Buy urgency:** "BIN" (buy it now), "this is it chief," "in for one" vs. "hard pass," "meh," "wait for Black Friday"
- **Expert knowledge:** Some commenters consistently provide accurate price history and product knowledge — their opinions should weigh more

A Reddit-specific sentiment model that handles sarcasm, community slang, and expert identification.

### Cross-Marketplace Awareness

When a deal is posted, automatically check:
- Same or similar product at Palmetto State Armory, Brownells, Midway USA, Primary Arms, Sportsman's Warehouse, Buds Gun Shop
- Calculate true landed cost: product price + typical shipping ($7.99-$15.99) + FFL transfer fee (national avg ~$25, user-configurable) + estimated tax
- Show the delta: "This r/gundeals post saves you $60-$80 vs. the next-best online price after all fees"

### Personalized Recommendations

Track user engagement (clicks, alert opens, purchase confirmations) to build a preference profile:
- Categories they care about (handguns, rifles, optics, ammo)
- Calibers they buy (9mm, .223/5.56, .308)
- Price sensitivity (do they click on budget deals or premium items?)
- Brands they prefer

Then: "You've clicked on 7 Glock deals in the last 3 months. Here's a Glock 19 Gen 5 MOS at the 11th percentile price."

---

## 3. What Wrong Looks Like

**Wrong: NLP that hallucinates product entities.** Title says "Glock 19 Magazine 15rd" — the entity extractor returns manufacturer=Glock, model=19, category=Handgun. But it's a magazine, not a handgun. The model must understand that "Magazine" is the product, and "Glock 19" is the compatibility reference. Similarly, "Holosun 507C for Glock MOS" — the product is the optic, not the Glock. Entity extraction on Reddit titles is an adversarial NLP problem: titles are inconsistently formatted, use abbreviations, omit key details, and mix product references. Off-the-shelf NER will fail. This requires a domain-specific model trained on thousands of labeled r/gundeals titles.

**Wrong: Price history without product normalization.** Tracking "Glock 19" prices but mixing Gen 3 ($399), Gen 4 ($449), Gen 5 ($499), Gen 5 MOS ($549), police trade-in Gen 4 ($349), and blue label ($425). The price distribution is meaningless because you're comparing five different products. Entity resolution must be precise enough to distinguish model variants. A Gen 5 MOS is not the same product family as a Gen 5 standard, even though both are "Glock 19s." The product family hierarchy: Manufacturer > Model > Generation > Variant > Condition. Price history is only meaningful at the correct level of specificity.

**Wrong: Sentiment analysis that can't handle r/gundeals culture.** "This is poverty pony territory" (means it's a budget AR-15 — neutral/mildly positive in context, not an insult). "In for 3" (extremely positive — they're buying multiples). "RIP my wallet" (positive — they bought it). "F" (sympathy that someone missed the deal — implies it was good). Standard sentiment models trained on product reviews or Twitter will misclassify most of these. The model must be trained on r/gundeals-specific labeled data.

**Wrong: Sell-out prediction that cries wolf.** If every alert says "SELLING FAST — 85% chance of sell-out!" users learn to ignore it. Prediction must be calibrated and honest. A 40% sell-out probability is still useful information — it means "you have time but don't wait all day." The system should show the probability, not just a binary "urgent/not urgent" flag. And calibration must be verified empirically: bin all predictions by predicted probability, check actual sell-out rates per bin.

**Wrong: Cross-marketplace comparison without landed cost.** "$399 on Reddit vs. $449 at Brownells" looks like a $50 savings. But the Reddit deal ships from a small dealer: $14.99 shipping + $25 FFL transfer + 7% state tax on $399 = $456 landed. Brownells has free shipping over $400 and no FFL needed for non-firearms (optics, accessories). True comparison requires the full cost stack, and it varies by product category (firearms require FFL; ammo, optics, and accessories don't).

**Wrong: Over-engineering ML when the scraping pipeline is fragile.** Reddit's API has broken three times in two years (API pricing changes, rate limit adjustments, authentication changes). The current system already has a three-tier fallback chain (PRAW > Arctic Shift > Deno proxy). Building a sophisticated NLP pipeline on top of a data source that could disappear requires the foundation to be extremely resilient. Phase 1 must harden the data pipeline before adding intelligence layers.

**Wrong: Losing the voice.** The current GunDealAlerts brand works because it sounds like a knowledgeable friend, not a corporation. "Hard to argue, especially when you can often find it under $379" — conversational, opinionated, specific. ML-generated deal descriptions that sound like "This firearm product is currently available at a competitive price point relative to historical market data" will kill engagement. Every user-facing output must pass the "would a knowledgeable gun buddy text you this?" test.

---

## 4. Architecture

### System Diagram

```
Reddit (r/gundeals)
  |
  |-- PRAW / Arctic Shift / Deno Proxy (existing fallback chain)
  |
Ingestion Pipeline (existing Flask + enhanced)
  |
  |-- Raw Post Storage (MongoDB: alerts collection, preserved as-is)
  |
  |-- NLP Entity Extraction Pipeline (NEW)
  |     |-- Title Parser (bracket removal, price regex — existing, enhanced)
  |     |-- Entity Extractor (fine-tuned model or structured LLM extraction)
  |     |-- Entity Normalizer (alias resolution: PSA=Palmetto State Armory, G19=Glock 19)
  |     |-- Product Family Resolver (match to catalog or create new entry)
  |     |-- Confidence Scorer (per-field extraction confidence)
  |
  |-- Price Intelligence Engine (NEW)
  |     |-- Price History per Product Family (time series in Postgres)
  |     |-- Percentile Calculator (rolling 12-month window)
  |     |-- Trend Detector (linear regression on log-prices)
  |     |-- Seasonal Pattern Detector (month-over-month deviation)
  |
  |-- Engagement Velocity Tracker (ENHANCED from existing deal_tracking)
  |     |-- Real-time snapshot at 1, 3, 5, 10, 15, 30, 60 min
  |     |-- Velocity features: upvote_rate, comment_rate, acceleration
  |     |-- Sell-out Predictor (logistic regression on velocity + price features)
  |
  |-- Sentiment Pipeline (NEW)
  |     |-- Comment Fetcher (PRAW comment stream for tracked deals)
  |     |-- Reddit-Specific Sentiment Model (labeled on r/gundeals data)
  |     |-- Commenter Expertise Scorer (historical accuracy weighting)
  |     |-- Aggregate Sentiment Score per deal
  |
  |-- Cross-Marketplace Comparator (NEW)
  |     |-- Price scrapers for major retailers (PSA, Brownells, Midway, etc.)
  |     |-- Landed Cost Calculator (price + shipping + FFL + tax)
  |     |-- Delta computation (r/gundeals price vs. best alternative)
  |
MongoDB (operational)              Postgres (analytical, NEW)
(alerts, users, email_queue,       (product_catalog, price_history,
 deal_tracking, categories,         entity_extractions, sentiment_scores,
 scheduler_logs — all preserved)    marketplace_prices, predictions)
  |
Notification Pipeline (existing + enhanced)
  |-- Email: Mailgun (existing, enhanced with price context)
  |-- X/Twitter: Tweepy (existing, enhanced with price percentile)
  |-- Push Notifications (NEW, for predicted sell-outs)
  |
Frontend (NEW)
  |-- Next.js 15+ (House Design Language)
  |-- Deal feed with real-time price intelligence
  |-- Product family price history pages
  |-- Personal deal dashboard
```

### Key Architectural Decisions

1. **MongoDB stays for operational data.** The existing 11 collections, TTL indexes, and notification pipeline are battle-tested. No migration risk. Postgres is added alongside for analytical workloads: price history time series, entity catalog, prediction logs. This is a dual-database architecture, not a replacement.

2. **NLP extraction runs synchronously on ingestion.** Every new post gets entity extraction before it enters the scoring pipeline. Latency budget: <2 seconds per title. This rules out full LLM inference per post at 1000 posts/hour during peak. Options: (a) fine-tuned small model (distilBERT or similar) for entity extraction, (b) structured LLM extraction via batch API with async backfill, (c) hybrid — regex for high-confidence fields (price, caliber, category) + model for harder fields (manufacturer, model, variant). The hybrid approach is the most practical for Phase 1.

3. **Price intelligence is precomputed.** Percentiles, trends, and seasonal patterns are recomputed nightly for all product families with >5 historical data points. When a new post arrives, it's a simple lookup: find the product family, fetch the precomputed percentile for this price. No heavy computation on the hot path.

4. **Sell-out prediction is a lightweight model.** Logistic regression on ~10 features. Trained on historical deal_tracking data (existing snapshots at 5, 10, 30, 60 minutes) with the OOS label being whether the post was marked `spoiler` (OOS) within X hours. The model is small, fast, and — critically — interpretable. No black-box neural net for something where calibration and trust matter this much.

5. **Frontend is a separate Next.js app.** The existing Flask app continues to run the scraping pipeline, notification system, and API. The Next.js frontend consumes data from both MongoDB (via Flask API) and Postgres (directly or via a thin API layer). This allows incremental migration without disrupting the working notification pipeline.

---

## 5. The NLP Entity Extraction Pipeline

### Step 1: Title Preprocessing

Raw: `[Handgun] PSA Dagger Full Size 9mm 4.49" Threaded Barrel, Black - $299.99 + S/H`

- Extract category from brackets: `Handgun` (existing logic, preserved)
- Extract price via regex: `$299.99` (existing logic, enhanced to handle `$X.XX/rd`, `$X,XXX`, `X CPR`, multi-price titles like "$299 after rebate / $349 before")
- Strip brackets and price to get product string: `PSA Dagger Full Size 9mm 4.49" Threaded Barrel, Black`

### Step 2: Entity Extraction

The product string is processed by a domain-specific extractor. Two viable approaches:

**Option A: Fine-tuned sequence labeling model.** Train a token classifier (distilBERT base) on 2,000+ labeled r/gundeals titles with BIO tags for: MANUFACTURER, MODEL, VARIANT, CALIBER, BARREL_LENGTH, BARREL_TYPE, COLOR, CONDITION, FEATURE. Training data comes from the 2+ years of historical posts in MongoDB — label a seed set manually, use active learning to expand. Inference: <50ms per title on CPU.

**Option B: Structured LLM extraction.** Send the product string to an LLM (Claude Haiku or GPT-4o-mini) with a structured output schema and few-shot examples. More accurate out of the box, but higher latency (~500ms) and cost (~$0.001/title = ~$30/month at current volume). Can run as async backfill rather than synchronous.

**Recommended: Hybrid.** Use regex for high-confidence fields (caliber, barrel length, price — these have reliable patterns). Use a fine-tuned model or LLM for harder fields (manufacturer, model, variant, condition). Start with Option B (LLM) for rapid iteration, migrate to Option A (fine-tuned model) once enough labeled data exists to train reliably.

### Step 3: Entity Normalization

Raw extractions contain aliases, abbreviations, and inconsistencies:

```
Alias Table (seeded, grows over time):
  PSA → Palmetto State Armory
  G19, G-19 → Glock 19
  Holosun 507c, HS507C, 507C-GR → Holosun 507C
  .223, .223 Rem, 223 Remington → .223 Remington
  5.56, 5.56x45, 5.56 NATO → 5.56x45mm NATO
  blem, blemished → Blemished
  LEO trade-in, police trade-in, LE trade → Law Enforcement Trade-In
```

The alias table is maintained in Postgres with a simple key-value structure. New aliases are discovered when the entity extractor produces a new string that's semantically similar to an existing canonical name (detected via embedding similarity or manual review queue).

### Step 4: Product Family Resolution

After normalization, the entity maps to a product family using a hierarchical key:

```
manufacturer: Palmetto State Armory
model: Dagger
variant: Full Size
caliber: 9mm
condition: New
→ product_family_slug: "psa-dagger-full-size-9mm-new"
```

Resolution rules:
- Exact match on slug → assign to existing family
- Partial match (same manufacturer + model, different variant) → suggest as new variant, queue for review
- No match → create new family, flag for human review if confidence < 0.8 on any key field
- Fuzzy matching for typos: Levenshtein distance < 2 on model name → candidate match

### Step 5: Price Assignment

The extracted price is assigned to the resolved product family's price history. This is the critical step — a price assigned to the wrong family corrupts the entire percentile calculation.

Guardrails:
- **Price range check:** If the price is >3 standard deviations from the family's historical mean, flag for review (possible miscategorization or extraordinary deal)
- **Category sanity check:** A handgun priced at $29.99 is likely a magazine or accessory miscategorized. A scope priced at $2,999 might be legitimate or might be a rifle-with-scope bundle
- **Confidence gating:** Only prices with entity extraction confidence >0.8 on manufacturer + model are auto-assigned. Below that threshold, they're queued for human review

### Step 6: Confidence Scoring

Each extracted field gets a confidence score (0.0-1.0):
- **1.0:** Explicitly stated and unambiguous ("Glock 19 Gen 5")
- **0.8-0.99:** Strong inference ("G19.5" → Glock 19 Gen 5, confidence 0.92)
- **0.5-0.79:** Reasonable inference with ambiguity ("Glock 19" without generation specified — could be Gen 3/4/5)
- **<0.5:** Low confidence, needs human review

The overall entity confidence is the minimum field confidence. A post with manufacturer=0.99, model=0.95, caliber=0.99, condition=0.45 has overall confidence 0.45 — the condition uncertainty dominates.

---

## 6. The Price Intelligence Model

### Data Foundation

The existing MongoDB `alerts` collection contains 2+ years of posts with extracted prices. Phase 1 backfills the product catalog by running entity extraction on all historical posts. This creates the initial price history per product family — likely 10,000+ unique families with varying data density.

### Percentile Computation

For each product family with >= 5 data points in the trailing 12 months:

```
percentile = (number of historical prices >= current price) / total historical prices * 100
```

A 10th percentile price means only 10% of historical postings for this product family were cheaper. This is the single most important number in the system — it replaces the user's mental price database.

### Seasonal Pattern Detection

Firearms pricing has strong seasonal patterns:
- **Black Friday / Cyber Monday:** 15-25% discounts on most categories
- **July 4th:** 10-15% discounts, especially on American manufacturers
- **Election years:** Demand spikes → prices rise 10-20% on AR-15s, standard-capacity magazines, and popular handguns
- **Post-election correction:** Prices drop 6-12 months after election as panic buying subsides
- **Tax refund season (Feb-Apr):** Demand increases, fewer deep discounts

Detection: for families with 18+ months of data, compute month-over-month average price deviation. Flag months with consistent >5% deviation from the annual mean as seasonal patterns. Surface to users: "This product is typically 12% cheaper in November."

### Trend Detection

Linear regression on log-transformed prices over the trailing 12 months. A negative slope means the product is getting cheaper (new model released, oversupply). A positive slope means it's getting more expensive (discontinued, supply constraints, regulatory threat).

Surface to users: "PSA Dagger prices have dropped 8% over the past 6 months as production has scaled up" or "Standard-capacity Glock magazines have increased 15% since the proposed legislation in March."

### Deal Quality Score

A composite that synthesizes multiple signals:

```
deal_quality = (
    price_percentile_score * 0.40 +    # Lower percentile = better score
    engagement_signal * 0.25 +          # Community validation
    sentiment_score * 0.15 +            # Comment analysis
    marketplace_delta * 0.10 +          # Savings vs. alternatives
    freshness * 0.10                    # Recency (decays over hours)
)
```

Price percentile is weighted heaviest because it's the most objective signal. Engagement and sentiment provide community validation. Marketplace delta provides external price confirmation. Freshness prevents stale deals from ranking high.

---

## 7. What Makes This Defensible

**2+ years of structured deal data.** Nobody else has a continuously scraped, timestamped, engagement-tracked archive of r/gundeals posts at this scale. This is the training data for every model in the system — entity extraction, price history, sell-out prediction, sentiment analysis. It cannot be recreated without time travel.

**Product entity catalog.** Once 10,000+ product families are resolved with normalized names, alias tables, and price histories, that catalog is a proprietary asset. Every new post resolves faster and more accurately because the catalog already knows the product. This is a compounding advantage — the system gets smarter with every post it processes.

**Engagement pattern data.** The existing `deal_tracking` collection snapshots upvotes and comments at 5, 10, 30, and 60 minutes post-creation. This is the training data for sell-out prediction. Combined with OOS status (spoiler tag), this is a labeled dataset for engagement → sell-out modeling that nobody else has.

**Community trust and brand voice.** GunDealAlerts has an established voice and following. The transition from "hot deal alert" to "this is the 8th percentile price with 91% sell-out probability" adds intelligence without losing personality. Users who trust the current alerts will trust smarter alerts even more — as long as the voice stays authentic.

**Domain-specific NLP.** A general-purpose product entity extractor will fail on "Anderson AM-15 poverty pony 5.56 16in M-LOK PSA BCG/CH combo." A model trained on thousands of r/gundeals titles will handle it. This domain expertise — encoded in training data, alias tables, and product family hierarchies — is the moat.

---

## 8. Phases

### Phase 1: NLP Entity Extraction + Product Catalog (6-8 weeks)

- Manually label 500 r/gundeals titles with entity tags (manufacturer, model, variant, caliber, barrel_length, condition, features)
- Implement hybrid extraction: regex for price/caliber/category (enhance existing), LLM-based extraction (Claude Haiku via batch API) for manufacturer/model/variant/condition
- Build alias normalization table seeded with top 200 manufacturers and 500 common abbreviations
- Implement product family resolution with slug-based matching
- Backfill: run extraction on all historical posts in MongoDB, build initial product catalog in Postgres
- Build confidence scoring pipeline with human review queue for low-confidence extractions
- Add Postgres alongside MongoDB (Supabase or self-hosted): product_catalog, entity_extractions, price_history tables
- Validation: manually verify 200 random extractions, target >85% accuracy on manufacturer + model

**Exit criteria:** Entity extraction runs on every new post. Product catalog contains 5,000+ families. Manual audit shows >85% accuracy on key fields.

### Phase 2: Price History + Percentile Scoring (4-6 weeks)

- Build price history pipeline: every extracted price assigned to its product family with timestamp
- Implement rolling 12-month percentile computation, recomputed nightly
- Build seasonal pattern detector for families with 18+ months of data
- Build trend detector (log-linear regression on trailing 12 months)
- Integrate percentile into notification pipeline: emails and tweets include "Xth percentile price" when confidence is high
- Enhance the Pillow-generated deal images to show price distribution curve with current price marked
- Validate: for 50 well-known products, manually verify percentiles against community knowledge ("everyone knows a Gen 5 Glock 19 under $450 is a good deal" — does the percentile agree?)

**Exit criteria:** Percentile scores appear in deal alerts. Price history pages exist for top 100 product families. Percentile rankings align with community consensus on 50 test products.

### Phase 3: Engagement Velocity + Sell-Out Prediction (4-6 weeks)

- Enhance deal_tracking to snapshot at 1, 3, 5, 10, 15, 30, 60 minutes (currently 5, 10, 30, 60)
- Compute velocity features: upvote_rate, comment_rate, acceleration (change in rate)
- Label historical data: spoiler tag = OOS, compute time-to-OOS for labeled deals
- Train logistic regression on velocity features + price percentile + product family popularity + time-of-day + day-of-week
- Implement calibration via Platt scaling; verify with calibration curve on held-out test set
- Integrate predictions into alerts: "78% chance of selling out within 3 hours" when calibrated confidence is meaningful
- Build prediction tracking: log every prediction, score against actual outcome, retrain monthly

**Exit criteria:** Sell-out predictions are calibrated within 10 percentage points (predicted 70% → actual 60-80%). Prediction appears in alerts for deals with >50% predicted sell-out probability.

### Phase 4: Frontend Rewrite to Next.js (8-10 weeks)

- Build Next.js 15+ app with House Design Language (OKLch tokens, shadcn/ui, Geist fonts)
- Pages: Deal Feed (real-time, filterable by category/caliber/price), Product Family page (price history chart, all historical posts, percentile context), Personal Dashboard (clicked deals, purchase history, recommendations)
- Flask API enhanced to serve deal data with entity extraction + price intelligence
- User accounts with preference tracking (categories, calibers, price thresholds)
- Personalized recommendations: "Based on your interest in 9mm handguns, here's a deal at the 15th percentile"
- Mobile-responsive — most deal hunting happens on phones
- Preserve and enhance image generation for X/Twitter sharing

**Exit criteria:** All current alert functionality accessible via web UI. Users can browse deals with price intelligence context. Personal dashboard tracks engagement for future recommendations.

### Phase 5: Cross-Marketplace + Sentiment Analysis (6-8 weeks)

- Build price scrapers for 5 major retailers (PSA, Brownells, Midway USA, Primary Arms, Buds Gun Shop)
- Implement landed cost calculator: product price + shipping (varies by retailer/weight) + FFL transfer (user-configurable, default $25) + estimated tax
- Build marketplace comparison: for each deal, find same/similar product at other retailers, compute true savings
- Implement Reddit comment sentiment pipeline: fetch comments for tracked deals via PRAW, run domain-specific sentiment analysis
- Build commenter expertise scoring: track which commenters provide accurate price context and product knowledge over time, weight their sentiment higher
- Train sentiment model on 1,000+ labeled r/gundeals comments (BIN=strong positive, "hard pass"=negative, sarcasm detection for "/s" and community-specific phrases)
- Integrate sentiment and marketplace data into deal alerts and frontend

**Exit criteria:** Marketplace comparison appears for >50% of firearm deals (where the product can be matched at a retailer). Sentiment scores correlate with deal quality (positive sentiment deals have lower price percentiles).

---

## 9. Risks and Mitigations

### Reddit API Stability

**Risk:** Reddit's API has undergone significant changes (pricing, rate limits, authentication). The entire system depends on Reddit as the primary data source. A full API shutdown or prohibitive pricing would be existential.

**Mitigation:** The three-tier fallback chain (PRAW > Arctic Shift > Deno proxy) already exists. Add a fourth tier: direct web scraping with rotating proxies as emergency fallback. More importantly, the product catalog and price history become independent assets — even if Reddit access degrades, the historical data and entity catalog retain value. Long-term: expand beyond Reddit (forums, deal sites, retailer RSS feeds) so no single source is a single point of failure.

### NLP Accuracy on Messy Titles

**Risk:** Reddit titles are wildly inconsistent. "[Rifle] This is a good deal on the DDM4V7 you guys" contains no price, no caliber, and the model name is buried in conversational text. Entity extraction will never be 100%.

**Mitigation:** Confidence scoring with graceful degradation. High-confidence extractions get full price intelligence treatment. Low-confidence extractions fall back to the existing engagement-only scoring. The system is strictly better than today even at 70% extraction accuracy — currently it's 0% entity extraction. Human review queue for low-confidence posts catches systematic errors and provides training data for model improvement.

### Community Trust

**Risk:** Users see a price percentile or sell-out prediction that's wrong, lose trust in the entire system. A single viral "GunDealAlerts said this was the 5th percentile but it was actually average" post could damage the brand.

**Mitigation:** Show confidence alongside every prediction. "8th percentile (based on 34 data points, high confidence)" vs. "~25th percentile (based on 6 data points, moderate confidence)." Never show a percentile for families with <5 data points. Never show sell-out prediction without calibration verification. The brand voice acknowledges uncertainty: "Looks like a solid deal — historically, this goes for about $340, so $299 is well below average" instead of "GUARANTEED LOWEST PRICE."

### LLM Inference Cost at Scale

**Risk:** Using Claude Haiku or similar for entity extraction at ~1000 posts/hour during peak = $30-50/month. Not prohibitive, but scales linearly with post volume and doesn't include sentiment analysis on comments.

**Mitigation:** LLM extraction is a bootstrapping tool. Use it to build a labeled dataset of 5,000+ titles, then train a fine-tuned distilBERT model that runs for free on CPU. The LLM becomes the fallback for edge cases and new product types. Sentiment analysis uses a smaller fine-tuned model from the start — comment volume is too high for per-comment LLM inference.

### Regulatory Sensitivity

**Risk:** Firearms marketplace data aggregation, price tracking, and purchase recommendations operate in a politically sensitive space. Platform policies, payment processors, and app stores have varying tolerance for firearms-related content.

**Mitigation:** The system tracks publicly available deal posts and prices — it does not facilitate transactions, process payments, or maintain inventory. It's a price comparison and alert tool, analogous to CamelCamelCamel for Amazon. Keep the product clearly in the "information and analytics" category. Avoid language that could be construed as facilitating sales. Self-host or use platforms with clear firearms-content policies.

### Cross-Marketplace Scraping Legality and Reliability

**Risk:** Scraping retailer prices may violate terms of service. Retailer websites change frequently, breaking scrapers.

**Mitigation:** Start with retailers that offer public APIs or structured data (some have affiliate/API programs). Use price checking as a secondary signal, not a primary dependency. Cache aggressively — prices don't change minute-to-minute. If a retailer blocks scraping, gracefully degrade: "marketplace comparison unavailable for this product." The system works without cross-marketplace data; it's an enhancement, not a requirement.

---

## 10. Success Metrics

### Deal Intelligence Quality (measured after Phase 2)

- **Entity extraction accuracy:** >85% correct on manufacturer + model for a random sample of 200 posts
- **Price percentile validity:** For 50 well-known products, percentile rankings align with expert community consensus (Glock 19 Gen 5 under $450 should be below 25th percentile)
- **Product family precision:** <5% of prices assigned to the wrong product family (verified by manual audit)
- **Catalog growth:** 500+ new product families resolved per month with >0.8 confidence

### Prediction Calibration (measured after Phase 3)

- **Sell-out calibration:** Predicted probabilities within 10 percentage points of actual rates across all bins
- **Percentile calibration:** A "10th percentile" deal should actually be cheaper than ~90% of historical prices for that family
- **False urgency rate:** <10% of "high sell-out probability" alerts are still in stock 24 hours later
- **Missed deal rate:** <5% of deals that sell out in <1 hour were predicted as "low sell-out probability"

### User Engagement (measured after Phase 4)

- **Click-through rate on alerts with price intelligence** vs. current alerts without — target 2x improvement
- **FOMO reduction:** Survey/track returns and "bought but regretted" signals — target measurable decrease
- **Time to decision:** Users with price percentile context should decide faster (click deal link or dismiss within 30 seconds vs. current browsing pattern)
- **Retention:** Users who receive price-intelligent alerts retain at higher rates than engagement-only alerts

### System Health

- **Entity extraction latency:** <2 seconds per post (sync path), <30 seconds per post (async LLM path)
- **Price history coverage:** >80% of posts with price >$50 successfully assigned to a product family
- **Notification latency:** <3 minutes from Reddit post creation to user alert (current baseline, must not regress)
- **Scraping pipeline uptime:** >99% of 60-second fetch cycles complete successfully (current baseline)
- **Data pipeline freshness:** Percentiles recomputed nightly, all product families current within 24 hours

### Business Metrics

- **Subscriber growth:** 2x current growth rate within 6 months of price intelligence launch
- **Premium conversion:** Price intelligence features drive conversion to paid tier (if monetized)
- **Brand authority:** GunDealAlerts becomes the reference source for "is this a good deal?" — measured by Reddit comments linking to or citing GDALERT price data

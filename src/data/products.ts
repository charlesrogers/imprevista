export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  multiplier: "data" | "skill" | "niche";
  multiplierDetail: string;
  accentColor: "green" | "blue" | "amber" | "purple";
  liveUrl: string | null;
  status: "live" | "beta" | "coming-soon";
  hero: { headline: string; subheadline: string };
  problem: {
    title: string;
    description: string;
    compensatingBehaviors: string[];
  };
  solution: {
    title: string;
    description: string;
    features: Array<{ title: string; description: string; icon: string }>;
  };
  audience: string;
  frameworks: string[];
  ctaText: string;
  ctaUrl: string;
  metaTitle: string;
  metaDescription: string;
}

export const products: Product[] = [
  {
    slug: "critterscout",
    name: "CritterScout",
    tagline:
      "17 geospatial data sources synthesized into scored hunting locations.",
    category: "Wildlife & Hunting",
    multiplier: "data",
    multiplierDetail: "17 sources nobody else combines",
    accentColor: "green",
    liveUrl: null,
    status: "beta",
    hero: {
      headline: "See what other hunters miss",
      subheadline:
        "CritterScout synthesizes 17 geospatial data sources into a single scored map — so you find the spots everyone else overlooks.",
    },
    problem: {
      title: "Scouting is a full-time job",
      description:
        "Public land hunters spend hours cross-referencing topo maps, harvest data, land ownership records, weather patterns, and satellite imagery across dozens of tabs. The data exists — nobody combines it.",
      compensatingBehaviors: [
        "Cross-referencing 17+ browser tabs of geo data",
        "Manually overlaying harvest reports on topo maps",
        "Guessing at hunting pressure from parking lot photos",
        "Spending more time scouting digitally than hunting",
      ],
    },
    solution: {
      title: "One map. Every signal.",
      description:
        "Three scoring pillars — Probability, Suitability, and Low Pressure — synthesized from 17 data sources into a composite score on every section of public land.",
      features: [
        {
          title: "Probability Scoring",
          description:
            "Harvest data, species density, and historical patterns predict where animals actually are.",
          icon: "Target",
        },
        {
          title: "Suitability Analysis",
          description:
            "Terrain, vegetation, water sources, and elevation profiled for your target species.",
          icon: "Mountain",
        },
        {
          title: "Pressure Detection",
          description:
            "Road access, trailhead proximity, and usage patterns reveal which spots get hammered.",
          icon: "Users",
        },
        {
          title: "Composite Decision Surface",
          description:
            "All three pillars converge on a single scored map. High score = go here.",
          icon: "Map",
        },
      ],
    },
    audience: "Public land hunters who scout digitally before going afield",
    frameworks: ["3 scoring pillars", "17 geospatial data sources", "Composite score max 90"],
    ctaText: "Join the Beta",
    ctaUrl: "#",
    metaTitle: "CritterScout — Scored Hunting Locations from 17 Data Sources",
    metaDescription:
      "CritterScout synthesizes 17 geospatial data sources into scored public land hunting locations. See what other hunters miss.",
  },
  {
    slug: "gradeoptimizer",
    name: "GradeOptimizer",
    tagline:
      "Canvas API data transformed into engagement drift detection.",
    category: "Education",
    multiplier: "skill",
    multiplierDetail: "Leading indicators surface disengagement early",
    accentColor: "blue",
    liveUrl: "https://grade-optimizer.vercel.app",
    status: "live",
    hero: {
      headline: "Catch disengagement before grades drop",
      subheadline:
        "GradeOptimizer transforms Canvas LMS data into leading indicators — submission timing patterns, engagement drift, and grade trajectory — so parents and teachers act early, not after the damage.",
    },
    problem: {
      title: "Grades are lagging indicators",
      description:
        "By the time a grade drops, the disengagement happened weeks ago. Parents check Canvas and see a number, but they can't tell if their kid is drifting. Teachers have 150 students and no time to spot the pattern.",
      compensatingBehaviors: [
        "Checking Canvas daily but only seeing final grades",
        "Waiting for progress reports that arrive too late",
        "Nagging kids about homework without knowing what's actually due",
        "Emailing teachers for context they don't have time to give",
      ],
    },
    solution: {
      title: "Leading indicators, not lagging grades",
      description:
        "Canvas already collects submission timestamps, assignment weights, and due dates. GradeOptimizer surfaces what that data actually means.",
      features: [
        {
          title: "Engagement Drift Detection",
          description:
            "Submission timing patterns reveal disengagement before grades reflect it.",
          icon: "TrendingDown",
        },
        {
          title: "Grade Trajectory",
          description:
            "What-if analysis shows which assignments actually move the needle.",
          icon: "LineChart",
        },
        {
          title: "Priority Queue",
          description:
            "Assignments ranked by impact on final grade — focus on what matters.",
          icon: "ListOrdered",
        },
        {
          title: "Multi-Child Dashboard",
          description:
            "All your kids, all their courses, one glanceable surface.",
          icon: "LayoutDashboard",
        },
      ],
    },
    audience: "Parents tracking their children's academic engagement",
    frameworks: ["Canvas API integration", "Submission timing analysis", "Grade impact modeling"],
    ctaText: "Try GradeOptimizer",
    ctaUrl: "https://grade-optimizer.vercel.app",
    metaTitle: "GradeOptimizer — Catch Student Disengagement Early",
    metaDescription:
      "GradeOptimizer transforms Canvas LMS data into engagement drift detection. See disengagement before grades drop.",
  },
  {
    slug: "gundealalerts",
    name: "GunDealAlerts",
    tagline:
      "Reddit noise filtered into curated weekly deal digests.",
    category: "E-Commerce",
    multiplier: "niche",
    multiplierDetail: "One job: best deal of the week",
    accentColor: "amber",
    liveUrl: "https://www.gundealalerts.com",
    status: "live",
    hero: {
      headline: "The best deals, without the noise",
      subheadline:
        "GunDealAlerts filters thousands of Reddit posts into a curated weekly digest — price history, community signal, and market context delivered as a clear buy or skip decision.",
    },
    problem: {
      title: "Deal hunting is a full-time scroll",
      description:
        "r/gundeals moves fast. Hundreds of posts daily, most mediocre. The actual good deals get buried. You either refresh constantly or miss the window. And you can never tell if a 'deal' is actually below average price.",
      compensatingBehaviors: [
        "Refreshing r/gundeals multiple times per day",
        "Manually tracking prices in spreadsheets",
        "Relying on upvotes that don't reflect actual value",
        "Missing deals because you checked 10 minutes too late",
      ],
    },
    solution: {
      title: "Curated signal from community noise",
      description:
        "Automated scraping, price history tracking, and community signal analysis — distilled into a weekly digest of deals actually worth your attention.",
      features: [
        {
          title: "Weekly Digest",
          description:
            "Top deals curated and delivered — no refreshing required.",
          icon: "Mail",
        },
        {
          title: "Price Context",
          description:
            "Historical pricing shows whether a 'sale' is actually below average.",
          icon: "DollarSign",
        },
        {
          title: "Community Signal",
          description:
            "Upvotes, comments, and sell-out speed indicate real demand.",
          icon: "MessageSquare",
        },
        {
          title: "Buy/Skip Verdict",
          description:
            "Every deal gets a clear recommendation — not just data, a decision.",
          icon: "ThumbsUp",
        },
      ],
    },
    audience: "Firearms enthusiasts who want deals without the scroll",
    frameworks: ["Reddit scraping pipeline", "Price history tracking", "Community signal scoring"],
    ctaText: "Visit GunDealAlerts",
    ctaUrl: "https://www.gundealalerts.com",
    metaTitle: "GunDealAlerts — Curated Gun Deals from Reddit",
    metaDescription:
      "GunDealAlerts filters Reddit noise into curated weekly deal digests with price history and buy/skip verdicts.",
  },
  {
    slug: "sports-dashboard",
    name: "Sports Dashboard",
    tagline:
      "Three independent models converge on a single picks page.",
    category: "Sports Analytics",
    multiplier: "data",
    multiplierDetail: "3 models converge on one picks page",
    accentColor: "purple",
    liveUrl: null,
    status: "beta",
    hero: {
      headline: "Framework-driven edge finding",
      subheadline:
        "Three independent statistical models — MI Bivariate Poisson, Dixon-Coles, and Elo — plus xG and odds data converge on a single picks surface. When frameworks agree, that's the edge.",
    },
    problem: {
      title: "Single-model analysis is shallow",
      description:
        "Most bettors rely on one model, one data source, or gut feel. They see one perspective and call it analysis. Real edges come from convergence — multiple independent models agreeing on the same mispricing.",
      compensatingBehaviors: [
        "Checking 3+ betting sites to compare odds manually",
        "Following tipsters who never show their methodology",
        "Relying on one model that overfits to recent results",
        "Gut-feel betting dressed up as 'analysis'",
      ],
    },
    solution: {
      title: "Convergence is the signal",
      description:
        "Three models built from different statistical foundations. When they agree, the signal is strong. When they disagree, you stay out.",
      features: [
        {
          title: "MI Bivariate Poisson",
          description:
            "Attack/defense strength ratings with correlated goal scoring.",
          icon: "BarChart3",
        },
        {
          title: "Dixon-Coles Model",
          description:
            "Time-weighted match results with low-score correction factors.",
          icon: "TrendingUp",
        },
        {
          title: "Elo Ratings",
          description:
            "Dynamic team strength adjusted for home advantage and margin.",
          icon: "Activity",
        },
        {
          title: "Single Picks Surface",
          description:
            "All three models plus xG and market odds on one decision page.",
          icon: "Target",
        },
      ],
    },
    audience: "Sports bettors who want methodology-driven picks, not tips",
    frameworks: [
      "MI Bivariate Poisson",
      "Dixon-Coles",
      "Elo ratings",
      "xG integration",
    ],
    ctaText: "Coming Soon",
    ctaUrl: "#",
    metaTitle: "Sports Dashboard — Multi-Model Sports Betting Analytics",
    metaDescription:
      "Three independent statistical models converge on a single picks page. Framework-driven edge finding for sports bettors.",
  },
  {
    slug: "mastery-graph",
    name: "Mastery Graph",
    tagline:
      "Domain-agnostic knowledge graph extraction from books and transcripts.",
    category: "Skill Acquisition",
    multiplier: "skill",
    multiplierDetail: "36 skills extracted from books + 60 transcripts",
    accentColor: "purple",
    liveUrl: null,
    status: "coming-soon",
    hero: {
      headline: "Make the skill path visible",
      subheadline:
        "Mastery Graph ingests books, podcast transcripts, and training notes to produce structured skill trees — with prerequisites, diagnostic branches, and progression paths from novice to expert.",
    },
    problem: {
      title: "Expertise is invisible",
      description:
        "The path from novice to expert is locked inside the heads of masters, scattered across books, podcasts, and field notes. There's no map. You plateau because you can't see what to work on next.",
      compensatingBehaviors: [
        "Reading 10 books on a topic and still not knowing the progression",
        "Watching hours of YouTube without a structured path",
        "Asking experts 'what should I learn next?' and getting vague answers",
        "Plateauing because you practice what's comfortable, not what's needed",
      ],
    },
    solution: {
      title: "Structured mastery from raw content",
      description:
        "Extract knowledge graphs from any domain's raw content — books, transcripts, field notes. Map what correct and incorrect look like at every level.",
      features: [
        {
          title: "Knowledge Graph Extraction",
          description:
            "NLP pipeline turns unstructured content into structured skill nodes and edges.",
          icon: "GitBranch",
        },
        {
          title: "Prerequisite Mapping",
          description:
            "Every skill knows what comes before it and what it unlocks.",
          icon: "Network",
        },
        {
          title: "Diagnostic Branches",
          description:
            "Identify where someone is stuck by mapping common error patterns.",
          icon: "Search",
        },
        {
          title: "Progression Visualization",
          description:
            "See the full tree from foundation to mastery — and where you are on it.",
          icon: "TreePine",
        },
      ],
    },
    audience: "Self-directed learners and coaches building structured curricula",
    frameworks: [
      "NLP knowledge extraction",
      "Skill tree modeling",
      "Prerequisite dependency graphs",
    ],
    ctaText: "Coming Soon",
    ctaUrl: "#",
    metaTitle: "Mastery Graph — Knowledge Graph Extraction for Skill Acquisition",
    metaDescription:
      "Extract structured skill trees from books, podcasts, and training notes. Make the path from novice to expert visible and walkable.",
  },
  {
    slug: "toolpulse",
    name: "ToolPulse",
    tagline:
      "Harbor Freight price tracker that reveals real deals from fake ones.",
    category: "Price Tracking",
    multiplier: "niche",
    multiplierDetail: "Price history reveals real deals from fake ones",
    accentColor: "amber",
    liveUrl: "https://charlesrogers.github.io/toolpulse/",
    status: "live",
    hero: {
      headline: 'Is that "sale" actually a deal?',
      subheadline:
        "ToolPulse tracks Harbor Freight prices over time — so you know whether that sale price is genuinely low or just marketing rotation.",
    },
    problem: {
      title: "Every price is a 'sale' price",
      description:
        "Harbor Freight runs constant sales, coupons, and promotions. It's impossible to tell if today's price is actually good or just the usual rotation. Without history, every deal looks like a deal.",
      compensatingBehaviors: [
        "Googling 'is this Harbor Freight price good' and finding nothing",
        "Bookmarking items and checking back manually",
        "Buying on impulse because the coupon expires tomorrow",
        "Maintaining mental models of 'normal' prices for tools you buy often",
      ],
    },
    solution: {
      title: "Price history cuts through marketing",
      description:
        "Automated price scraping and historical tracking for Harbor Freight products. See the trend, know the real floor.",
      features: [
        {
          title: "Price History Charts",
          description:
            "Full price timeline for every tracked product — see the real pattern.",
          icon: "LineChart",
        },
        {
          title: "Current Sale Detection",
          description:
            "Flags items currently below their historical average.",
          icon: "Tag",
        },
        {
          title: "Deal Quality Score",
          description:
            "How far below average is today's price? Context, not just numbers.",
          icon: "Gauge",
        },
        {
          title: "Product Search",
          description:
            "Find any Harbor Freight product and see its full price history.",
          icon: "Search",
        },
      ],
    },
    audience: "Harbor Freight shoppers who want to buy at real lows, not marketing lows",
    frameworks: ["Automated price scraping", "Historical price tracking", "Sale pattern analysis"],
    ctaText: "Check Prices",
    ctaUrl: "https://charlesrogers.github.io/toolpulse/",
    metaTitle: "ToolPulse — Harbor Freight Price History Tracker",
    metaDescription:
      "Track Harbor Freight prices over time. See whether a sale is genuinely low or just marketing rotation.",
  },
  {
    slug: "options-edge",
    name: "Options Edge Finder",
    tagline:
      "GARCH volatility forecasting versus implied volatility to find mispriced options.",
    category: "Options Trading",
    multiplier: "data",
    multiplierDetail: "GARCH forecast vs. IV = mispricing signal",
    accentColor: "blue",
    liveUrl: null,
    status: "beta",
    hero: {
      headline: "Find mispriced volatility",
      subheadline:
        "Options Edge Finder uses GARCH volatility forecasting to identify when implied volatility diverges from statistical reality — surfacing mispriced options as clear trade-or-pass decisions.",
    },
    problem: {
      title: "IV is the market's guess, not the truth",
      description:
        "Options are priced on implied volatility — the market's consensus forecast. But consensus is often wrong. Without an independent volatility model, you're trading the crowd's opinion, not the math.",
      compensatingBehaviors: [
        "Eyeballing IV percentile without a forecast to compare against",
        "Selling premium based on 'IV is high' without knowing if it's high enough",
        "Using free screeners that show IV rank but no independent model",
        "Manually comparing realized vs implied vol in spreadsheets",
      ],
    },
    solution: {
      title: "Independent volatility forecast meets market pricing",
      description:
        "GARCH model produces a statistical volatility forecast. Compare it to the market's implied volatility. When they diverge, that's the edge.",
      features: [
        {
          title: "GARCH Forecasting",
          description:
            "Statistical volatility model trained on historical returns.",
          icon: "Brain",
        },
        {
          title: "IV Comparison",
          description:
            "Side-by-side: what the model says vs. what the market prices.",
          icon: "GitCompare",
        },
        {
          title: "Mispricing Signal",
          description:
            "When GARCH and IV diverge significantly, that's a trade candidate.",
          icon: "Zap",
        },
        {
          title: "Trade/Pass Decision",
          description:
            "Clear output: trade direction, magnitude of edge, and confidence.",
          icon: "CheckCircle",
        },
      ],
    },
    audience: "Options traders who want quantitative edge detection, not tips",
    frameworks: ["GARCH(1,1) volatility model", "IV surface analysis", "Statistical edge scoring"],
    ctaText: "Coming Soon",
    ctaUrl: "#",
    metaTitle: "Options Edge Finder — GARCH vs IV Mispricing Detection",
    metaDescription:
      "GARCH volatility forecasting versus implied volatility to find mispriced options. Quantitative edge detection for options traders.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

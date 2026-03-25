import { Database, Monitor, Search } from "lucide-react";

const multipliers = [
  {
    number: "01",
    title: "10x Data",
    description:
      "The data already exists — public APIs, geo datasets, market feeds, community signals. Nobody combines it. We synthesize scattered sources into a single decision surface, so you see what everyone else misses.",
    icon: Database,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    number: "02",
    title: "10x Skill",
    description:
      "Scaffolded mastery. Extract knowledge graphs from raw content — books, transcripts, field notes. Map what correct and incorrect look like at every level. Make the path from novice to expert visible and walkable.",
    icon: Monitor,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    number: "03",
    title: "10x Niche",
    description:
      "Not platforms — surgical instruments. Hyper-specific tools for hyper-specific needs. One job, done better than anything general-purpose could. The user walks away knowing what to do, not just seeing data.",
    icon: Search,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
];

export function MultipliersGrid() {
  return (
    <section className="py-24 md:py-36 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
            The Thesis
          </div>
          <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight">
            Three multipliers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {multipliers.map((m) => (
            <div
              key={m.number}
              className="rounded-xl border bg-card p-8 shadow-sm shadow-black/[0.04] hover:shadow-md hover:shadow-black/[0.06] transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center mb-5`}
              >
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className="text-[11px] font-mono text-muted-foreground/50 mb-2">
                {m.number}
              </div>
              <h3 className="text-[18px] font-semibold mb-3">{m.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

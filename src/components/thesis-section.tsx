export function ThesisSection() {
  return (
    <section className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight mb-6">
              The data is there.
              <br />
              Nobody&rsquo;s connecting it.
            </h2>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                Every domain is drowning in information&mdash;books, podcasts,
                field data, APIs, public records. But it sits in silos. Nobody
                synthesizes it. The tools are generic. The skill paths are
                invisible.
              </p>
              <p>
                The result: people plateau because they can&rsquo;t see what to
                work on next. They miss opportunities because the data is
                scattered across 17 sources. They use bloated platforms when they
                need a scalpel.
              </p>
              <p className="text-foreground font-medium">
                We build the opposite: tools that harness the data nobody else
                combines, structure knowledge into walkable skill paths, and
                solve very specific problems with very specific products.
              </p>
            </div>
          </div>

          {/* Animated graph visual */}
          <div className="flex justify-center">
            <div className="w-full max-w-[400px] aspect-square relative">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                className="w-full h-full"
              >
                {/* Edges */}
                <line x1="120" y1="80" x2="200" y2="55" className="stroke-primary" strokeWidth="1.5" opacity="0.35" />
                <line x1="200" y1="55" x2="290" y2="85" className="stroke-primary" strokeWidth="1.5" opacity="0.35" />
                <line x1="120" y1="80" x2="100" y2="180" className="stroke-primary" strokeWidth="1.5" opacity="0.3" />
                <line x1="200" y1="55" x2="200" y2="175" className="stroke-chart-5" strokeWidth="1.5" opacity="0.4" />
                <line x1="290" y1="85" x2="300" y2="185" className="stroke-primary" strokeWidth="1.5" opacity="0.3" />
                <line x1="100" y1="180" x2="200" y2="175" className="stroke-chart-5" strokeWidth="1.5" opacity="0.35" />
                <line x1="200" y1="175" x2="300" y2="185" className="stroke-primary" strokeWidth="1.5" opacity="0.35" />
                <line x1="100" y1="180" x2="80" y2="290" className="stroke-primary" strokeWidth="1.5" opacity="0.25" />
                <line x1="200" y1="175" x2="200" y2="300" className="stroke-chart-5" strokeWidth="1.5" opacity="0.35" />
                <line x1="300" y1="185" x2="320" y2="290" className="stroke-primary" strokeWidth="1.5" opacity="0.25" />
                <line x1="80" y1="290" x2="200" y2="300" className="stroke-primary" strokeWidth="1.5" opacity="0.3" />
                <line x1="200" y1="300" x2="320" y2="290" className="stroke-chart-5" strokeWidth="1.5" opacity="0.3" />

                {/* Row 1: Foundations */}
                <circle cx="120" cy="80" r="8" className="fill-primary" opacity="0.7" />
                <circle cx="200" cy="55" r="11" className="fill-primary" opacity="0.9" />
                <circle cx="290" cy="85" r="7" className="fill-primary" opacity="0.6" />

                {/* Row 2: Core */}
                <circle cx="100" cy="180" r="9" className="fill-chart-5" opacity="0.7" />
                <circle cx="200" cy="175" r="13" className="fill-chart-5" opacity="0.9" />
                <circle cx="300" cy="185" r="8" className="fill-primary" opacity="0.7" />

                {/* Row 3: Mastery */}
                <circle cx="80" cy="290" r="6" className="fill-primary" opacity="0.5" />
                <circle cx="200" cy="300" r="10" className="fill-chart-5" opacity="0.7" />
                <circle cx="320" cy="290" r="7" className="fill-primary" opacity="0.5" />

                {/* Labels */}
                <text x="200" y="28" textAnchor="middle" className="fill-muted-foreground" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="500">
                  FOUNDATIONS
                </text>
                <text x="200" y="155" textAnchor="middle" className="fill-muted-foreground" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="500">
                  CORE SKILLS
                </text>
                <text x="200" y="345" textAnchor="middle" className="fill-muted-foreground" fontFamily="var(--font-geist-mono)" fontSize="10" fontWeight="500">
                  MASTERY
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HarderProblem() {
  return (
    <section className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
              The Harder Problem
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight mb-6">
              Conviction is cheap.
              <br />
              Being right still isn&rsquo;t.
            </h2>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                Nobody can stop you now&mdash;which hands every builder a
                harder problem. When permission was the gate, someone else had
                to be convinced before a thing could exist. Now the only person
                you can fool is yourself.
              </p>
              <p>
                So every bet ships with a pre-registered way to be wrong: write
                down what would prove it wrong, ship it this week, read the
                result.
              </p>
              <p className="text-foreground font-medium">
                The win isn&rsquo;t shipping faster. It&rsquo;s killing faster.
                Being wrong in a week costs almost nothing. Being wrong in a
                quarter costs the quarter.
              </p>
            </div>
          </div>

          {/* Old shape vs new shape */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm shadow-black/[0.04]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">
                The old shape
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-muted-foreground">
                <span>Pitch it</span>
                <span className="text-muted-foreground/40">&rarr;</span>
                <span>Convince someone</span>
                <span className="text-muted-foreground/40">&rarr;</span>
                <span>Build for a quarter</span>
                <span className="text-muted-foreground/40">&rarr;</span>
                <span>Find out at the end</span>
              </div>
              <div className="mt-4 text-[12px] text-muted-foreground/60">
                Cost of being wrong: the quarter.
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm shadow-black/[0.04]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-primary mb-4">
                The new shape
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-foreground">
                <span>Write down what would prove you wrong</span>
                <span className="text-primary/60">&rarr;</span>
                <span>Ship it this week</span>
                <span className="text-primary/60">&rarr;</span>
                <span>Read the result</span>
              </div>
              <div className="mt-4 text-[12px] text-muted-foreground">
                Cost of being wrong: a week.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComplaintsAreJobs() {
  return (
    <section className="py-24 md:py-36 border-t">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
          Where the Bets Come From
        </div>
        <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight mb-6">
          Every complaint is a job in disguise.
        </h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed text-left md:text-center">
          <p>
            People complain all day, for free. Somebody annoyed enough to say
            it out loud is already trying to make progress and getting
            stuck&mdash;that&rsquo;s a job. Complaints tell you where the
            energy is.
          </p>
          <p>
            Energy isn&rsquo;t enough. The second question is the hard one: can
            anything be done about it, and is there an edge&mdash;a reason this
            answer beats what they already have? Telling a real job from a loud
            complaint is the discipline everything here runs on.
          </p>
          <p className="text-foreground font-medium">
            A problem and an edge is the whole list now. No permission
            required. No market-size estimate.
          </p>
        </div>
      </div>
    </section>
  );
}

export function GateMoved() {
  return (
    <section className="py-24 md:py-36 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Authority vs answers */}
          <div className="order-2 md:order-1 space-y-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm shadow-black/[0.04]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-3">
                Search engines rank authority
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Decades of accumulated links. A game incumbents win by
                default&mdash;a deficit of thousands of referring domains that
                no new product ever closes.
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm shadow-black/[0.04]">
              <div className="text-[11px] font-mono uppercase tracking-widest text-primary mb-3">
                Assistants rank answers
              </div>
              <p className="text-[13px] text-foreground leading-relaxed">
                An assistant doesn&rsquo;t care who linked to you. It cares
                whether your page resolves the question. The one door where
                being small isn&rsquo;t a handicap.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
              The Turn
            </div>
            <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight mb-6">
              The gate didn&rsquo;t disappear.
              <br />
              It moved.
            </h2>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                If anyone can build anything, building stops being what
                separates products. Being found starts.
              </p>
              <p className="text-foreground font-medium">
                Distribution, not production, is the constraint that
                matters&mdash;and distribution is moving under everyone&rsquo;s
                feet at once. That shift is the studio&rsquo;s second bet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

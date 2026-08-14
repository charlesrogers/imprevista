import { ArrowUpRight } from "lucide-react";

export function PlyFeature() {
  return (
    <section className="py-24 md:py-36 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-xl overflow-hidden bg-[#0a0a1a] px-8 py-16 md:px-16 md:py-24 text-center">
          <div className="text-[12px] font-mono uppercase tracking-widest text-white/40 mb-3">
            The Thesis, Shipped
          </div>
          <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-tight text-white mb-6">
            People Like You
          </h2>
          <div className="max-w-xl mx-auto space-y-4 text-[15px] text-white/60 leading-relaxed">
            <p>
              Dating apps are built to keep people swiping&mdash;engagement is
              the business model, which makes a wedding churn. People Like You
              is a matchmaker, not a deck of cards.
            </p>
            <p>
              Matches don&rsquo;t get you married. You need a spark. Every
              introduction opens with a tailored preview of why you&rsquo;d
              like them&mdash;and they get one about you. It&rsquo;s as if
              you&rsquo;d already had the first date. No cold opens, no fishing
              for something to say.
            </p>
          </div>
          <a
            href="https://people-like-you.com"
            className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:opacity-90 active:translate-y-px transition-opacity"
          >
            people-like-you.com
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

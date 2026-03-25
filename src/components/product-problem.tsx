import { AlertCircle } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductProblem({ product }: { product: Product }) {
  return (
    <section className="py-16 md:py-24 border-t">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-[12px] font-mono uppercase tracking-widest text-destructive">
            The Struggling Moment
          </span>
        </div>

        <h2 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-4">
          {product.problem.title}
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
          {product.problem.description}
        </p>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-[13px] font-semibold mb-4">
            What you do today:
          </h3>
          <ul className="space-y-3">
            {product.problem.compensatingBehaviors.map((behavior, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                <span className="text-[13px] text-muted-foreground leading-relaxed">
                  {behavior}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

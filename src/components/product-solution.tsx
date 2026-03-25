import * as LucideIcons from "lucide-react";
import type { Product } from "@/data/products";

type IconName = keyof typeof LucideIcons;

function getIcon(name: string) {
  const Icon = LucideIcons[name as IconName] as React.ComponentType<{ className?: string }>;
  return Icon || LucideIcons.Box;
}

export function ProductSolution({ product }: { product: Product }) {
  return (
    <section className="py-16 md:py-24 border-t">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
          The Solution
        </div>
        <h2 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-4">
          {product.solution.title}
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
          {product.solution.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {product.solution.features.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-5 shadow-sm shadow-black/[0.04]"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="text-[14px] font-semibold mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Frameworks */}
        {product.frameworks.length > 0 && (
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Methodology
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.frameworks.map((fw) => (
                <span
                  key={fw}
                  className="px-3 py-1 rounded-4xl bg-secondary text-[11px] font-medium text-secondary-foreground"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

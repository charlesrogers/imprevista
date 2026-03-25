import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

const accentMap = {
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  purple: "bg-chart-5/10 text-chart-5",
};

const multiplierLabel = {
  data: "10x Data",
  skill: "10x Skill",
  niche: "10x Niche",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl border bg-card p-6 shadow-sm shadow-black/[0.04] hover:shadow-md hover:shadow-black/[0.06] transition-all flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <Badge
          variant="secondary"
          className={cn("text-[10px] font-medium", accentMap[product.accentColor])}
        >
          {product.category}
        </Badge>
        {product.status === "live" && (
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        )}
        {product.status === "beta" && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Beta
          </span>
        )}
        {product.status === "coming-soon" && (
          <span className="text-[10px] text-muted-foreground font-medium">
            Coming Soon
          </span>
        )}
      </div>

      <h3 className="text-[17px] font-semibold mb-2 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">
        {product.tagline}
      </p>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-[12px] font-mono text-muted-foreground">
          <span className="text-foreground font-medium">
            {multiplierLabel[product.multiplier]}
          </span>
          {" "}&mdash; {product.multiplierDetail}
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

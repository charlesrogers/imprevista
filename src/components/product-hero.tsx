"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

const accentMap = {
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  purple: "bg-chart-5/10 text-chart-5",
};

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
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

        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight leading-[1.1] mb-4">
          {product.hero.headline}
        </h1>
        <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          {product.hero.subheadline}
        </p>

        {product.liveUrl && product.liveUrl !== "#" && (
          <a
            href={product.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "rounded-lg active:translate-y-px")}
          >
            {product.ctaText}
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        )}
      </div>
    </section>
  );
}

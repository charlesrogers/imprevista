"use client";

import { buttonVariants } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductCta({ product }: { product: Product }) {
  if (!product.liveUrl || product.liveUrl === "#") return null;

  return (
    <section className="py-16 md:py-24 border-t">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-[24px] font-bold tracking-tight mb-3">
          Ready to try {product.name}?
        </h2>
        <p className="text-[15px] text-muted-foreground mb-8">
          {product.tagline}
        </p>
        <a
          href={product.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "rounded-lg active:translate-y-px")}
        >
          {product.ctaText}
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </section>
  );
}

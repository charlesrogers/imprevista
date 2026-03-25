import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export function CrossSell({ currentSlug }: { currentSlug: string }) {
  const others = products
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section className="py-16 md:py-24 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-[20px] font-bold tracking-tight">
            More from Imprevista
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

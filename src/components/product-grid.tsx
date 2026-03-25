import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export function ProductGrid() {
  return (
    <section className="py-24 md:py-36 border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-[12px] font-mono uppercase tracking-widest text-primary mb-3">
            Portfolio
          </div>
          <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight">
            The thesis in practice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

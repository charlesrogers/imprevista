import Link from "next/link";
import { products } from "@/data/products";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-[15px] font-bold tracking-tight">
              Imprevista
            </Link>
            <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              Tools that synthesize overlooked data, accelerate mastery, and
              solve narrow problems with surgical precision.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Contact
            </h3>
            <a
              href="mailto:charles@imprevista.com"
              className="text-[13px] text-primary hover:underline font-mono"
            >
              charles@imprevista.com
            </a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t">
          <p className="text-[11px] text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Imprevista. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

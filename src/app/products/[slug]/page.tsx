import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProductBySlug } from "@/data/products";
import { ProductHero } from "@/components/product-hero";
import { ProductProblem } from "@/components/product-problem";
import { ProductSolution } from "@/components/product-solution";
import { ProductCta } from "@/components/product-cta";
import { CrossSell } from "@/components/cross-sell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `https://imprevista.com/products/${product.slug}`,
      siteName: "Imprevista",
    },
    twitter: {
      card: "summary_large_image",
      title: product.metaTitle,
      description: product.metaDescription,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductHero product={product} />
      <ProductProblem product={product} />
      <ProductSolution product={product} />
      <ProductCta product={product} />
      <CrossSell currentSlug={product.slug} />
    </>
  );
}

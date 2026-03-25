import { HeroCanvas } from "@/components/hero-canvas";
import { ThesisSection } from "@/components/thesis-section";
import { MultipliersGrid } from "@/components/multipliers-grid";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <>
      <HeroCanvas />
      <ThesisSection />
      <MultipliersGrid />
      <ProductGrid />
    </>
  );
}

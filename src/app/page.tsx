import { HeroCanvas } from "@/components/hero-canvas";
import {
  HarderProblem,
  ComplaintsAreJobs,
  GateMoved,
} from "@/components/argument";
import { PlyFeature } from "@/components/ply-feature";

export default function Home() {
  return (
    <>
      <HeroCanvas />
      <HarderProblem />
      <ComplaintsAreJobs />
      <GateMoved />
      <PlyFeature />
    </>
  );
}

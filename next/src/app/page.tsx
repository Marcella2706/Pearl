import { WellnessFeatures } from "@/sections/wellness-features";
import { WellnessHero } from "@/sections/wellness-Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <WellnessHero />
      <WellnessFeatures />
    </div>
  );
}

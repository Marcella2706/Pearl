"use client"
import { HeroSection, Preloader } from "@/components";
import { OffersSection } from "@/components";
import { FinancialFreedom } from "@/components";
import { FinancialFuture } from "@/components";
import { IntroSection } from "@/components";
import { FAQ } from "@/components";
import { Footer } from "@/components";
import { Header } from "@/components";
import { GlobalStyles } from "@/components/Layout/GlobalStyles";
import StyledComponentsRegistry from "@/hooks/Registry";
import ReactLenis from "@studio-freight/react-lenis";
import { useState } from "react";
export default function Home() {
    const [complete, setComplete] = useState(false);
  return (
    <div className="min-h-screen">
          <StyledComponentsRegistry>
      <ReactLenis
        root
        options={{ easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}
      >
        <GlobalStyles />
        <Preloader setComplete={setComplete} />
        <div className={complete ? 'complete' : 'not_complete'}>
            <Header/>
      <HeroSection />
      <OffersSection />
      <FinancialFreedom />
      <FinancialFuture />
      <IntroSection />
      <FAQ />
       <Footer />
         
        </div>
      </ReactLenis>
    </StyledComponentsRegistry>
      
    </div>
  );
}

"use client";
import Header from "@/app/components/Section/Header";
import Preloader from "./components/Preloader";
import { useState } from "react";
import HeroSection from "./components/Section/HeroSection/herosection";
import Footer from "./components/Section/Footer";
import FAQ from "./components/Section/FAQ";
import OffersSection from "./components/Section/OffersSection";
import FinancialFreedom from "./components/Section/FinancialFreedom";
import FinancialFuture from "./components/Section/FinancialFuture";
import IntroSection from "./components/Section/IntroSection";

export default function Home() {
  const [complete, setComplete] = useState(false);
  return (
    <div className="min-h-screen bg-background">
        <Preloader setComplete={setComplete} />
          <div className={complete ? 'complete' : 'not_complete'}>
              <Header/>
              <HeroSection/>
              <OffersSection />
              <FinancialFreedom />
              <FinancialFuture />
              <IntroSection />
              <FAQ/>
              <Footer />
        </div>
    </div>
  );
}

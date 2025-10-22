'use client';
import Image from 'next/image';
import GetStartedButton from '@/app/components/Common/GetStartedButton';
import MaskText from '@/app/components/Common/MaskText';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  mobileParagraphPhrases,
  mobilePhrases,
  paragraphPhrases,
  phrases,
} from "@/app/Varibles/hero_constants";

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="mt-25">
      <div className="flex flex-col items-center max-w-4xl mx-auto text-center bg-no-repeat bg-top bg-contain">
        <div className="flex items-center justify-center gap-2.5 px-3 py-1 rounded-full border border-secondly bg-background backdrop-blur-sm shadow-sm mb-4">
          <span className="text-secondary text-base font-normal">Introducing Jivika</span>
          <Image
            src={'/images/logo.png'} 
            alt="Jivika logo"
            className="rounded-full"
            width={20}
            height={20}
          />
        </div>

        <div className="flex flex-col gap-6 pb-8 md:gap-4 md:pb-6">
          {isMobile ? (
            <>
              <div className="w-full">
                <MaskText
                  phrases={mobilePhrases}
                  tag="h1"
                  sizeClass="text-5xl sm:text-6xl md:text-8xl text-secondary font-normal "
                />
              </div>

              <div className="w-full">
                <MaskText
                  phrases={mobileParagraphPhrases}
                  tag="p"
                  sizeClass="text-base sm:text-2xl md:text-3xl font-normal text-secondly"
                  className="text-secondly  font-normal"
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <MaskText
                  phrases={phrases}
                  tag="h1"
                  sizeClass="text-5xl md:text-7xl lg:text-8xl text-secondary font-normal"
                />
              </div>

              <div className="w-full">
                <MaskText
                  phrases={paragraphPhrases}
                  tag="p"
                  sizeClass="text-md sm:text-lg md:text-xl lg:text-2xl font-normal"
                  className="text-secondly font-normal"
                />
              </div>
            </>
          )}
        </div>

        <GetStartedButton padding="1rem 2rem" />
      </div>
    </section>
  );
};

export default HeroSection;

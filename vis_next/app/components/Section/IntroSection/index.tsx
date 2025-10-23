'use client';
import { useState } from 'react';
import Image from 'next/image';
import MaskText from '@/app/components/Common/MaskText';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  edges,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
} from '@/app/Varibles/intro_constants';

const IntroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="pt-30 md:pt-24">
      <div className="flex flex-col items-center w-[90%] max-w-[1440px] mx-auto">
        <header className="flex flex-col items-center text-center max-w-4xl mx-auto mb-29 md:mb-20">
          <div className="flex flex-col items-center gap-6 md:gap-4">
            {isMobile ? (
              <>
                <MaskText 
                  phrases={mobileHeaderPhrase} 
                  tag="h1" 
                  sizeClass="text-6xl md:text-9xl font-normal text-foreground"
                />
                <MaskText 
                  phrases={mobileParagraphPhrase} 
                  tag="p" 
                  sizeClass="max-w-[41.75rem] text-foreground-muted text-base md:text-xl font-normal leading-6 md:leading-7"
                />
              </>
            ) : (
              <>
                <MaskText 
                  phrases={desktopHeaderPhrase} 
                  tag="h1" 
                  sizeClass="text-6xl md:text-[4.75rem] font-normal text-foreground"
                />
                <MaskText 
                  phrases={desktopParagraphPhrase} 
                  tag="p" 
                  sizeClass="max-w-[41.75rem] text-foreground-muted text-base md:text-xl font-normal leading-6 md:leading-7"
                />
              </>
            )}
          </div>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {edges.map((edge, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <div className="flex gap-2 items-center">
                <MaskText 
                  phrases={new Array(edge.point)} 
                  tag="h3" 
                  sizeClass="text-2xl font-medium text-foreground"
                />
              </div>
              <MaskText 
                phrases={new Array(edge.details)} 
                tag="p" 
                sizeClass="max-w-[26rem] text-foreground-muted text-base font-normal leading-6"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

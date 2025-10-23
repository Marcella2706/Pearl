'use client';
import Image from 'next/image';
import MaskText from '@/app/components/Common/MaskText';
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  desktopBriefNotePhrase,
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  edges,
  mobileBriefNotePhrase,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
} from '@/app/Varibles/financial_freedom_constants';
export const imageVariants = {
  hidden: {
    scale: 1.6,
  },
  visible: {
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.6, 0.05, -0.01, 0.9],
      delay: 0.2,
    },
  },
};

const FinancialFreedom = () => {
  const isMobile = useIsMobile();

  return (
    <section className="mt-44 mb-44 md:mt-40md:mb-40">
      <div className="w-[90%] max-w-[1440px] mx-auto mb-33 md:mb-24 flex flex-col items-center">
        <header className="flex flex-col items-center gap-6 max-w-4xl mx-auto mb-31 md:mb-20 text-center">
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-30">
          {edges.map((edge, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <div className="flex gap-2 items-center  ">
                <Image src={edge.icon} alt="icon" width={30} height={30}/>
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

      <div className="max-h-219 py-33 px-18 md:py-8 md:px-6 bg-primary">
        {isMobile ? (
          <MaskText 
            phrases={mobileBriefNotePhrase} 
            tag="p" 
            sizeClass="text-foreground text-[3.75rem] md:text-[8rem] font-normal max-w-[1440px] mx-auto"
          />
        ) : (
          <MaskText 
            phrases={desktopBriefNotePhrase} 
            tag="p" 
            sizeClass="text-foreground text-[3.75rem] md:text-[8rem] font-normal max-w-[1440px] mx-auto"
          />
        )}
      </div>
    </section>
  );
};

export default FinancialFreedom;

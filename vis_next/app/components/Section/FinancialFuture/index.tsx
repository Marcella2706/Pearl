'use client';
import Image from 'next/image';
import MaskText from '@/app/components/Common/MaskText';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  cardsInfo,
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
  stats,
} from '@/app/Varibles/financial_future_constants';

const FinancialFuture = () => {
  const isMobile = useIsMobile();

  return (
    <section className="pt-31 md:pt-20">
      <div className="w-[90%] max-w-[1440px] mx-auto">
        <header className="flex flex-col gap-6 max-w-4xl mb-25 md:mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          {cardsInfo.map((info, i) => (
            <div 
              key={i} 
              className="h-110 md:h-167.5 rounded-xl border border-border bg-background-foreground transition-all duration-300"
            >
              <div className="flex flex-col gap-4 max-w-129 mx-6 my-6 md:mx-13 md:my-13 md:mb-12">
                <MaskText 
                  phrases={new Array(info.title)} 
                  tag="h3" 
                  sizeClass="text-2xl md:text-4xl font-medium leading-7 text-foreground transition-colors duration-300"
                />
                <MaskText 
                  phrases={new Array(info.details)} 
                  tag="p" 
                  sizeClass="text-base md:text-xl font-normal leading-6 md:leading-7 text-foreground-muted transition-colors duration-300"
                />
              </div>
              <div 
                className="h-[15.28rem] md:h-[24.55rem] grid place-items-center bg-cover bg-center md:bg-contain"
                style={{ backgroundImage: "url('/images/card_grid.png')" }}
              >
                <Image 
                  src={info.icon} 
                  alt="icon" 
                  width={isMobile ? 120 : 150} 
                  height={isMobile ? 120 : 150}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="my-25 md:my-15 w-full flex items-center justify-between">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <MaskText 
                phrases={new Array(stat.number)} 
                tag="h1" 
                sizeClass="text-xl md:text-[5rem] font-semibold text-foreground transition-colors duration-300"
              />
              <MaskText 
                phrases={new Array(stat.subtitle)} 
                tag="p" 
                sizeClass="text-foreground-muted text-xs md:text-lg font-medium uppercase transition-colors duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinancialFuture;

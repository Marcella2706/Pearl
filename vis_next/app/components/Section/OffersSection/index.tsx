'use client';
import MaskText from '@/app/components/Common/MaskText';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  desktopHeaderPhrases,
  desktopParagraphPhrase,
  mobileParagraphPhrase,
  offers,
} from "@/app/Varibles/offers_constants"

const OffersSection = () => {
  const isMobile = useIsMobile();
  return (
    <section className="py-20 md:py-12 mt-40">
      <div className="max-w-[1440px] w-[90%] mx-auto">
        <header className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto mb-28 md:mb-16">
          <MaskText
            phrases={desktopHeaderPhrases}
            tag="h1"
            sizeClass="text-4xl md:text-6xl lg:text-7xl text-forground" 
          />

          {isMobile ? (
            <MaskText
              phrases={mobileParagraphPhrase}
              tag="p"
              sizeClass="max-w-2xl text-foreground-muted text-xl md:text-base font-normal leading-relaxed text-foreground-muted"
            />
          ) : (
            <MaskText
              phrases={desktopParagraphPhrase}
              tag="p"
              sizeClass="max-w-2xl text-foreground-muted text-xl font-normal leading-relaxed text-foreground-muted"
            />
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:gap-8">

          <div
            className="col-span-1 md:col-span-2 overflow-hidden h-[500px] md:h-[450px] rounded-3xl border border-border bg-background-forground flex flex-col relative"
            style={{
              backgroundImage: "url('/images/offer_card_grid_1.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="mt-12 md:mt-6 relative flex justify-center flex-1">
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-transparent to-background-forground z-10" />
            </div>

            <div className="p-10 md:p-6 max-w-xl flex flex-col gap-4 relative z-20">
              <h2 className="text-3xl md:text-2xl font-semibold leading-tight text-forground">
                {offers[0].title}
              </h2>
              <p className="text-foreground-muted text-base font-normal leading-relaxed">
                {offers[0].details}
              </p>
            </div>
          </div>

          <div
            className="col-span-1 md:col-span-1 overflow-hidden h-[500px] md:h-[450px] rounded-3xl border border-border bg-background-forground flex flex-col relative"
            style={{
              backgroundImage: "url('/images/offer_card_grid_2.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="mt-12 md:mt-6 relative flex justify-center flex-1">
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-transparent to-background-forground z-10" />
            </div>

            <div className="p-10 md:p-6 flex flex-col gap-4 relative z-20">
              <h2 className="text-3xl md:text-2xl font-semibold leading-tight text-forground">
                {offers[1].title}
              </h2>
              <p className="text-foreground-muted text-base font-normal leading-relaxed">
                {offers[1].details}
              </p>
            </div>
          </div>
        </div>

 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">

          <div
            className="col-span-1 md:col-span-1 overflow-hidden h-[500px] md:h-[450px] rounded-3xl border border-border bg-background-forground flex flex-col relative"
            style={{
              backgroundImage: "url('/images/offer_card_grid_3.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="mt-12 md:mt-6 relative flex justify-center flex-1">
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-transparent to-background-forground z-10" />
            </div>

            <div className="p-10 md:p-6 flex flex-col gap-4 relative z-20">
              <h2 className="text-3xl md:text-2xl font-semibold leading-tight text-forground">
                {offers[2].title}
              </h2>
              <p className="text-foreground-muted text-base font-normal leading-relaxed">
                {offers[2].details}
              </p>
            </div>
          </div>
          <div
            className="col-span-1 md:col-span-2 overflow-hidden h-[500px] md:h-[450px] rounded-3xl border border-border bg-background-forground flex flex-col relative"
            style={{
              backgroundImage: "url('/images/offer_card_grid_4.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="mt-12 md:mt-6 relative flex justify-center flex-1">
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-transparent to-background-forground z-10" />
            </div>

            <div className="p-10 md:p-6 max-w-xl flex flex-col gap-4 relative z-20">
              <h2 className="text-3xl md:text-2xl font-semibold leading-tight text-forground">
                {offers[3].title}
              </h2>
              <p className="text-foreground-muted text-base font-normal leading-relaxed">
                {offers[3].details}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;

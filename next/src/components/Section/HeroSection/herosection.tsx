'use client';
import Image from 'next/image';
import { Wrapper, Inner, Pill, HeroTextContainer } from './styles';
import { GetStartedButton } from '@/components';
import MaskText from '@/components/Common/MaskText';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  mobileParagraphPhrases,
  mobilePhrases,
  paragraphPhrases,
  phrases,
} from '@/lib/Constants/hero';

const HeroSection = () => {
  const isMobile = useIsMobile();
  return (
    <Wrapper>
      <Inner>
        <Pill>
          <span>Introducing Jivika</span>
          <Image src={'/svgs/image.png'} alt="chevron-right" className="rounded-full" width={20} height={20}/>
        </Pill>
        <HeroTextContainer>
          {isMobile ? (
            <>
              <MaskText phrases={mobilePhrases} tag="h1" />
              <MaskText phrases={mobileParagraphPhrases} tag="p" />
            </>
          ) : (
            <>
              <MaskText phrases={phrases} tag="h1" />
              <MaskText phrases={paragraphPhrases} tag="p" />
            </>
          )}
        </HeroTextContainer>
        <GetStartedButton padding="1rem 2rem" />
      </Inner>
    </Wrapper>
  );
};

export default HeroSection;

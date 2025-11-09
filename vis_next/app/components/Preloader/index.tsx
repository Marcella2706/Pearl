'use client';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Preloader = ({
  setComplete,
}: {
  setComplete: Dispatch<SetStateAction<boolean>>;
}) => {
  const word = ['J', 'i', 'v', 'i','k','a'];

  const spans = useRef<(HTMLDivElement | null)[]>([]); 
  const imageRef = useRef(null);
  const secondOverlayRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(imageRef.current, {
      rotate: '360deg',
      ease: 'back.out(1.7)',
      duration: 1.4,
    });
    tl.to(imageRef.current, {
      y: '-200%', 
      ease: 'back.out(1.7)', 
    });
    tl.to(spans.current, {
      y: '-300%',
      ease: 'back.out(1.7)', 
      duration: 1.4, 
      stagger: 0.05,
    });
    
    tl.to([wrapperRef.current, secondOverlayRef.current], {
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'back.out(1.7)',
      duration: 1,
      stagger: 0.2,
      onComplete: () => {
        setComplete(true);
      },
    });


    tl.to(secondOverlayRef.current, {
      scaleY: 0,
      transformOrigin: 'top',
      ease: [0.83, 0, 0.17, 1] as any,
      duration: 1,
      delay: -0.9, 
    });
  }, [setComplete]);

  return (
    <>

      <div 
        ref={wrapperRef}
        className="bg-background text-foreground fixed h-screen w-screen z-9999 top-0 left-0 bottom-0 right-0 flex items-end justify-end"
      >
        <div className="flex gap-8 items-center px-8 overflow-hidden h-80 md:gap-4 md:h-52">
          <Image 
            ref={imageRef} 
            src="/images/logo.png" 
            alt="import icon"  
            className="rounded-full w-96 h-96 md:w-28 md:h-28"
            width={400} 
            height={400}
          />
          <div className="overflow-hidden flex items-center">
            {word.map((t, i) => (
              <div
                key={i}
                ref={(element) => {
                  spans.current[i] = element; 
                }}
                className="font-semibold text-[25rem] text-foreground md:text-[6rem]"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
  
      <div 
        ref={secondOverlayRef}
        className="bg-primary fixed h-screen w-screen z-9990 top-0 left-0 bottom-0 right-0"
      ></div>
    </>
  );
};

export default Preloader;

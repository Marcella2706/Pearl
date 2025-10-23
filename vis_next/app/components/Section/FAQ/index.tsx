'use client';
import { useRef, useState } from 'react';
import { AnimatePresence, useInView, motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import MaskText from "@/app/components/Common/MaskText"
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  animate,
  desktopHeaderPhrase,
  faqData,
  mobileHeaderPhrase,
} from "@/app/Varibles/faq_constants"

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const accordionRef = useRef(null);
  const isInView = useInView(accordionRef, {
    once: true,
    margin: '-10%',
    amount: 0.4,
  });

  const isMobile = useIsMobile();

  return (
    <div className="py-33 pb-40">
      <div className="w-[90%] max-w-[1440px] mx-auto flex flex-col gap-25">
        <div className="max-w-4xl">
          {isMobile ? (
            <MaskText 
              phrases={mobileHeaderPhrase} 
              tag="h1" 
              sizeClass="text-[3.75rem] font-normal text-foreground"
            />
          ) : (
            <MaskText 
              phrases={desktopHeaderPhrase} 
              tag="h1" 
              sizeClass="text-[6rem] font-normal text-foreground"
            />
          )}
        </div>
        
        <div ref={accordionRef} className="flex flex-col gap-6">
          {faqData.map((item, index) => (
            <motion.div
              variants={animate as any}
              initial="initial"
              animate={isInView ? 'open' : ''}
              custom={index}
              key={index}
              className="flex flex-col pb-4 border-b border-border overflow-hidden"
            >
              <motion.div 
                onClick={() => toggleItem(index)}
                className="flex items-center justify-between cursor-pointer text-2xl md:text-base font-medium mb-6 md:mb-8 gap-4 text-foreground"
              >
                {item.question}
                <ArrowDown className={`transition-transform duration-300 ${openItem === index ? 'rotate-180' : ''}`}></ArrowDown>

              </motion.div>
              
              <AnimatePresence>
                {openItem === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="text-foreground-muted text-base font-normal leading-6"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

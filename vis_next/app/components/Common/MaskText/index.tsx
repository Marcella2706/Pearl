// components/Common/MaskText.tsx
'use client';
import { useInView, motion, Variants } from 'framer-motion';
import { useRef } from 'react';

type MaskTextProps = {
  phrases: string[];
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  sizeClass?: string;
  className?: string; 
};

const defaultSizes: Record<string, string> = {
  sm: 'text-base md:text-2xl lg:text-3xl',
  md: 'text-lg md:text-4xl lg:text-5xl',
  lg: 'text-2xl md:text-5xl lg:text-7xl',
  xl: 'text-4xl md:text-6xl lg:text-7xl',
};

const MaskText = ({ phrases, tag = 'h1', sizeClass, className = '' }: MaskTextProps) => {
  const animate: Variants = {
    initial: { y: '100%' },
    open: (i: number) => ({
      y: '0%',
      transition: { duration: 1, delay: 0.08 * i, ease: [0.33, 1, 0.68, 1] as any },
    }),
  };
  const body = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(body, { once: true, margin: '-10%', amount: 0.4 });

  const resolvedSizeClass = sizeClass ?? defaultSizes.xl;

  const Tag: any = tag;

  return (
    <div ref={body}>
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            variants={animate}
            initial="initial"
            animate={isInView ? 'open' : ''}
            custom={index}
            className="inline-block"
          >
            <Tag className={`${resolvedSizeClass} font-bold leading-tight text-forground-muted ${className}`}>
              {phrase}
            </Tag>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default MaskText;

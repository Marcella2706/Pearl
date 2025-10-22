'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

type AnimationProps = {
  rest: {
    y: number;
  };
  hover: {
    y: number;
    transition: {
      duration: number;
      ease: number[];
      type: string;
    };
  };
};

const titleAnimation = {
  rest: {
    transition: {
      staggerChildren: 0.005,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.005,
    },
  },
};

const letterAnimation = {
  rest: {
    y: 0,
  },
  hover: {
    y: -25,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: 'tween',
    },
  },
};

const letterAnimationTwo = {
  rest: {
    y: 25,
  },
  hover: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: 'tween',
    },
  },
};

const AnimatedLink = ({ title,className }: { title: string,className?:string }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer flex flex-col overflow-hidden ${className || ''}`}
    >
      <AnimatedWord
        title={title}
        animations={letterAnimation}
        isHovered={isHovered}
      />
      <div className="absolute top-0">
        <AnimatedWord
          title={title}
          animations={letterAnimationTwo}
          isHovered={isHovered}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedLink;

const AnimatedWord = ({
  title,
  animations,
  isHovered,
}: {
  title: string;
  animations: AnimationProps;
  isHovered: boolean;
}) => (
  <motion.span
    variants={titleAnimation}
    initial="rest"
    animate={isHovered ? 'hover' : 'rest'}
    className="whitespace-nowrap relative"
  >
    {title.split('').map((char, i) =>
      char === ' ' ? (
        <motion.span key={i} className="relative inline-block whitespace-nowrap text-secondary text-base font-normal md:text-secondary">&nbsp;</motion.span>
      ) : (
        <motion.span 
          variants={animations as any} 
          key={i}
          className="relative inline-block whitespace-nowrap text-secondary text-base font-normal md:text-secondary"
        >
          {char}
        </motion.span>
      )
    )}
  </motion.span>
);

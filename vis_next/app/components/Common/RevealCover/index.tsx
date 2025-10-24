'use client';
import { motion } from 'framer-motion';

const variant = {
  hidden: {
    width: '100%',
  },
  visible: {
    width: '0%',
    transition: {
      duration: 1.4,
      ease: [0.6, 0.05, -0.01, 0.9] as any,
    },
  },
};

const RevealCover = () => {
  return (
    <motion.div
      variants={variant as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.6, once: true }}
      className="absolute top-0 left-0 w-full h-full bg-background z-10 rounded-none sm:rounded-none md:rounded-xl"
    />
  );
};

export default RevealCover;

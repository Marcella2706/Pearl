'use client';

import Image from 'next/image';
import bars from '../../../../public/svgs/bars.svg';
import GetStartedButton from '@/app/components/Common/GetStartedButton';
import ThemeSwitcher from '../../Common/ThemeSwitcher';
import AnimatedLink from '@/app/components/Common/AnimatedLink';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { links, menu } from '../../../Varibles/header_constants';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  // Filter out Home, Feature, About Us links
  const filteredLinks = links.filter(
    (link) => !['Home', 'Features', 'About Us'].includes(link.linkTo)
  );

  // Close menu when switching from mobile to desktop
  useState(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <section className="py-3 border-b border-secondly">
      <div className="flex items-center justify-between w-[90%] max-w-[1440px] mx-auto">
        {/* Logo */}
        <div className='flex items-center gap-2 font-bold text-xl text-secondary'>
          <Image 
            src={'/images/logo.png'} 
            alt="logo" 
            priority 
            height={30} 
            width={30} 
            className='rounded-full'
          />
          Jivika
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <nav className="flex items-center gap-8">
              {filteredLinks.map((link, i) => (
                <AnimatedLink key={i} title={link.linkTo} />
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <div 
                onClick={() => router.push('/auth')}
                className="flex items-center gap-4 cursor-pointer"
              >
                <AnimatedLink title="Login" />
                <GetStartedButton padding={'8px 16px'} />
              </div>
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div 
            className="relative p-2 cursor-pointer z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              variants={menu as any}
              initial="closed"
              className="absolute bg-accent rounded-[25px]"
              style={{ zIndex: 1 }}
            />
            <Image 
              src={bars} 
              alt="menu" 
              className="relative object-cover" 
              style={{ zIndex: 2 }}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                duration: 0.5, 
                ease: [0.175, 0.885, 0.32, 1.275] 
              }}
              className="fixed top-0 right-0 h-full w-[280px] bg-background-secondary shadow-2xl z-50 p-6 flex flex-col gap-8"
            >
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-foreground hover:text-accent transition-colors"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-6">
                {filteredLinks.map((link, i) => (
                  <div key={i} onClick={() => setIsOpen(false)}>
                    <AnimatedLink 
                      title={link.linkTo} 
                      className="text-foreground text-xl font-medium"
                    />
                  </div>
                ))}
              </nav>

              {/* Theme Switcher */}
              <div className="mt-4">
                <ThemeSwitcher />
              </div>

              {/* Auth Actions */}
              <div className="mt-auto flex flex-col gap-4">
                <div 
                  onClick={() => {
                    router.push('/auth');
                    setIsOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <AnimatedLink 
                    title="Login" 
                    className="text-foreground text-lg font-medium"
                  />
                </div>
                <GetStartedButton padding={'12px 24px'} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Header;

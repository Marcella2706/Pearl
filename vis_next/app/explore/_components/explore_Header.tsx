"use client"
import React from 'react';
import NextImage from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/app/components/Common/ThemeSwitcher';

type Props = {
  title?: string;
  subtitle?: string;
  logoSrc?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string; 
};

export default function ExploreHeader({
  title = 'Jivika',
  subtitle = '',
  logoSrc = '/images/logo.png',
  onBack,
  rightSlot,
}: Props) {
  const router = useRouter();
  function handleBack() {
    if (onBack) return onBack();
    try {
      router.back();
    } catch (e) {
      if (typeof window !== 'undefined') window.history.back();
    }
  }


  return (
    <header className="w-full bg-background shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-background hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/60 transition-shadow shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-md ring-1 ring-gray-700">
                <NextImage
                  src={logoSrc}
                  alt={`${title} logo`}
                  priority
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-lg text-foreground tracking-tight">{title}</span>
                {subtitle ? (
                  <span className="text-xs text-foreground-muted -mt-0.5">{subtitle}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {rightSlot}
       
      
          </div>
        </div>
      </div>
    </header>
  );
}

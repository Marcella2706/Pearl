'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ToggleWrapper = styled(motion.div)`
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--hover-bg);
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ToggleThumb = styled(motion.div)`
  width: 26px;
  height: 26px;
  background: var(--Background);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  color: var(--white);
`;

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ToggleWrapper>
        <ToggleThumb />
      </ToggleWrapper>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <ToggleWrapper 
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
    >
      <ToggleThumb
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </ToggleThumb>
    </ToggleWrapper>
  );
};

export default ThemeToggle;

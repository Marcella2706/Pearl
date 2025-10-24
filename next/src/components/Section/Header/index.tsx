'use client';

import Image from 'next/image';
import {
  Wrapper,
  Inner,
  LogoContainer,
  Nav,
  CallToActions,
  AbsoluteLinks,
  BurgerMenu,
} from './styles';
import ic_bars from '../../../../public/svgs/ic_bars.svg';
import { GetStartedButton, ThemeToggle } from '@/components';
import AnimatedLink from '@/components/Common/AnimatedLink';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { links, menu } from './constants';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <Wrapper>
      <Inner>
        <LogoContainer>
          <div className='logo flex items-center gap-2 font-bold text-xl'>
          <Image src={'/svgs/image.png'} alt="logo" priority height={30} width={30} className='rounded-full'/>
          Jivika
          </div>
          <BurgerMenu onClick={() => setIsOpen(!isOpen)}>
            <motion.div
              variants={menu as any}
              animate={isOpen ? 'open' : 'closed'}
              initial="closed"
            ></motion.div>
            <Image src={ic_bars} alt="bars" />
          </BurgerMenu>
        </LogoContainer>
        <Nav className={isOpen ? 'active' : ''}>
          {links.map((link, i) => (
            <AnimatedLink key={i} title={link.linkTo} />
          ))}
        </Nav>
        <CallToActions className={isOpen ? 'active' : ''}>
          <ThemeToggle />
          <div onClick={()=>{
            router.push('/auth');
          }}>
            <AnimatedLink title="Login" className="scroll-m-20 text-2xl font-semibold tracking-tight  " />
            <GetStartedButton padding={'6px'}></GetStartedButton>
          </div>
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
      <div className="">
        {/* Light mode logo */}
        <Image
          alt="proPAL AI Logo"
          src="/assets/logo1.png"
          width={720}
          height={720}
          className="h-12 w-auto object-contain dark:hidden" // hidden in dark mode
          priority
        />
        {/* Dark mode logo */}
        <Image
          alt="proPAL AI Logo"
          src="/assets/logo2.png"
          width={720}
          height={720}
          className="h-12 w-auto object-contain hidden dark:block" // visible only in dark mode
          priority
        />
      </div>
  );
};

export default Logo;

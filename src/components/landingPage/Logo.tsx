'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className="logo-wrapper flex items-center">
          <Image
            alt="proPAL AI Logo"
            src="/assets/logo.png"
            width={240}
            height={160}
            className="h-72 md:h-48 lg:h-60 object-contain"
            priority
          />
        </div>
      </div>
    </Link>
  );
};

export default Logo;

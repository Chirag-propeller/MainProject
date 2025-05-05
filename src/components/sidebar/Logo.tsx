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
        <Image
          alt="proPAL AI Logo"
          src="/assets/logo1.png"
          width={720}
          height={720}
        //   width={60} // smaller width
        //   height={40} // smaller height
          className="h-12 w-auto object-contain" // fixed height, auto width
          priority
        />
      </div>
  );
};

export default Logo;

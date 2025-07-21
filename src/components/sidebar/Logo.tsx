"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  collapsed: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", collapsed }) => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center">
        {!collapsed ? (
          <Image
            alt="proPAL AI Logo"
            src="/assets/logo.png"
            width={100}
            height={50}
            className="h-12 object-contain"
            priority
          />
        ) : (
          <Image
            alt="proPAL AI Logo"
            src="/assets/croppedfav.png"
            width={20}
            height={20}
            className="h-12 w-auto pl-2 object-contain"
            priority
          />
        )}
      </div>
    </Link>
  );
};

export default Logo;

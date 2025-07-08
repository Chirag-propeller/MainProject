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
            width={120}
            height={50}
            className="w-auto object-contain"
            priority
          />
        ) : (
          <div className="h-12"></div>
        )}
      </div>
    </Link>
  );
};

export default Logo;

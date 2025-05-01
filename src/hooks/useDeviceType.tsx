// hooks/useDeviceType.ts
"use client"
import { useEffect, useState } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const getDeviceType = (width: number): DeviceType => {
  if (width < 640) return 'mobile'; // Tailwind's `sm`
  if (width < 1024) return 'tablet'; // Tailwind's `md`-`lg`
  if (width < 1280) return 'laptop'; // Tailwind's `xl`
  return 'desktop'; // Tailwind's `2xl`
};

export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    typeof window !== 'undefined' ? getDeviceType(window.innerWidth) : 'desktop'
  );

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

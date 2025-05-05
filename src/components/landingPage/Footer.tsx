'use client';

import React from 'react';
import Link from 'next/link';
import { useDeviceType } from '@/hooks/useDeviceType';
import Logo from './Logo';
// import { useIsMobile } from '@/hooks/use-mobile';
// import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";


  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <footer className="bg-white pt-12 md:pt-20 pb-8 border-t border-gray-100">
      <div className="container-custom pl-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="mb-6 ">
                <Logo/>
              {/* <Logo /> */}
            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-md">
              Building the future of business communication with AI voice agents that transform customer interactions and drive productivity.
            </p>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Product</h3>
            <ul className="space-y-2">

              <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-gray-700 hover:text-decagon-primary cursor-pointer"
            >
              Features
            </button> 
            <br/>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-gray-700 hover:text-decagon-primary cursor-pointer"
            >
              Pricing
            </button>
              {/* <li><Link href="/product/pricing" className="text-sm text-gray-600 hover:text-decagon-primary">Pricing</Link></li> */}
              {/* <li><Link href="/product/enterprise" className="text-sm text-gray-600 hover:text-decagon-primary">Enterprise</Link></li>
              <li><Link href="/product/security" className="text-sm text-gray-600 hover:text-decagon-primary">Security</Link></li> */}
            </ul>
          </div>

          {/* Resources */}
          {/* <div className="col-span-1">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources/documentation" className="text-sm text-gray-600 hover:text-decagon-primary">Documentation</Link></li>
              <li><Link href="/resources/api-reference" className="text-sm text-gray-600 hover:text-decagon-primary">API Reference</Link></li>
              <li><Link href="/resources/blog" className="text-sm text-gray-600 hover:text-decagon-primary">Blog</Link></li>
              <li><Link href="/resources/case-studies" className="text-sm text-gray-600 hover:text-decagon-primary">Case Studies</Link></li>
            </ul>
          </div> */}

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/company/about" className="text-sm text-gray-600 hover:text-decagon-primary">About</Link></li>
              {/* <li><Link href="/company/careers" className="text-sm text-gray-600 hover:text-decagon-primary">Careers</Link></li> */}
              <li><Link href="/company/contact" className="text-sm text-gray-600 hover:text-decagon-primary">Contact</Link></li>
              {/* <li><Link href="/company/partners" className="text-sm text-gray-600 hover:text-decagon-primary">Partners</Link></li> */}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-decagon-primary">Privacy</Link></li>
              <li><Link href="/legal/terms" className="text-sm text-gray-600 hover:text-decagon-primary">Terms</Link></li>
              {/* <li><Link href="/legal/gdpr" className="text-sm text-gray-600 hover:text-decagon-primary">GDPR</Link></li> */}
              {/* <li><Link href="/legal/compliance" className="text-sm text-gray-600 hover:text-decagon-primary">Compliance</Link></li> */}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} proPAL AI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {/* Social Icons */}
            {['facebook', 'twitter', 'globe', 'rss'].map((icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-decagon-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="..." /> {/* You can replace this with specific SVG path data per platform if needed */}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

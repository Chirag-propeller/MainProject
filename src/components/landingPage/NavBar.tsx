// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import Logo from "./Logo";

// import { Button } from "@/components/ui/button";
// import Logo from "@/components/Logo";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    router.push(`/#${id}`);
    const el = document.getElementById(id);
    if (el) {
      setMobileMenuOpen(false);
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 md:h-20 items-center justify-between">
        <Logo />

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button
              onClick={() => scrollToSection("use-cases")}
              className="text-sm font-medium text-gray-700 hover:text-decagon-primary cursor-pointer"
            >
              Use Cases
            </button>
            {/* <button className="flex items-center text-sm font-medium text-gray-700 hover:text-decagon-primary transition">
              Platform <ChevronDown className="ml-1 h-4 w-4" />
            </button> */}
            {/* <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Voice Agent Features
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Success Stories
              </button>
            </div> */}
          </div>

          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary cursor-pointer"
          >
            Features
          </button>

          {/* <Link
            href="/enterprise"
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary"
          >
            Enterprise
          </Link> */}
          <Link
            href="/legal/privacy"
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary"
          >
            Privacy
          </Link>

          {/* <Link
            href="/pricing"
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary"
          >
            Pricing
          </Link> */}

          <Link
            href="/legal/terms"
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary"
          >
            Terms of Service
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-decagon-primary"
          >
            Sign in
          </Link>
          <Button
            onClick={() => scrollToSection("cta")}
            // className="bg-decagon-primary hover:bg-decagon-primary/90 text-white"
          >
            Get started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-decagon-primary"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white p-4 border-t shadow-md absolute w-full">
          <button
            onClick={() => scrollToSection("features")}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("use-cases")}
            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Use Cases
          </button>
          {/* <Link
            href="/enterprise"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Enterprise
          </Link> */}

          <Link
            href="/legal/privacy"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Privacy
          </Link>

          <Link
            href="/legal/terms"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Terms of Service
          </Link>
          <Link
            href="/login"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-decagon-primary"
          >
            Sign in
          </Link>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                scrollToSection("cta");
                setMobileMenuOpen(false);
              }}
              // className="rounded-full"
              // className="bg-decagon-primary hover:bg-decagon-primary/90 text-white font-medium w-full"
            >
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

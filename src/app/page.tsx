"use client";
import Footer from "@/components/landingPage/Footer";
import CallToAction from "@/components/landingPage/CallToAction";
import FeatureSection from "@/components/landingPage/FeatureSection";
import HeroSection from "@/components/landingPage/HeroSection";
import LogoMarquee from "@/components/landingPage/LogoMarique";
import Navbar from "@/components/landingPage/NavBar";
import UseCaseSection from "@/components/landingPage/UseCaseSection";
import PricingSection from "@/components/landingPage/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <div className="container-custom mx-auto">
        <FeatureSection />
        <UseCaseSection />
        {/* <div id="testimonials">
          <TestimonialsSection/>
        </div> */}
      </div>
      <PricingSection />
      <CallToAction />
      <Footer />
    </main>
  );
}

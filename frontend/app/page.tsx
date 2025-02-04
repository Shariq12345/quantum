"use client";

import CTA from "@/components/cta";
import { FeaturesSection } from "@/components/Features";
import { Footer } from "@/components/footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { Pricing } from "@/components/pricing";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

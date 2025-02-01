"use client";

import { FeaturesSection } from "@/components/Features";
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
    </div>
  );
}

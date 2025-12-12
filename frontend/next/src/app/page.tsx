"use client";

import {
  HeroSection,
  BestSellersSection,
  NewArrivalsSection,
  CategoryShowcase,
  BrandStory,
  ContactSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <HeroSection />

      {/* Featured Products */}
      <BestSellersSection />

      {/* Categories */}
      <CategoryShowcase />

      {/* New Arrivals */}
      <NewArrivalsSection className="bg-base-100" />

      {/* Brand Story */}
      <BrandStory />

      {/* Contact */}
      <ContactSection />
    </main>
  );
}

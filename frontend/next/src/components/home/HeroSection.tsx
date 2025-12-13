"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  TrustIndicator,
  FeaturedSellerBadge,
} from "@/components/ui/TrustBadges";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-linear-to-br from-primary/20 via-base-100 to-accent/20 ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <FeaturedSellerBadge />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6 leading-tight">
            Premium Letterpress
            <span className="block text-primary">Wholesale Cards</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Artisan greeting cards crafted with hand-mixed inks on 100% cotton
            cardstock. Direct wholesale pricing for boutiques and retailers.
          </p>

          {/* Trust indicators */}
          <div className="flex justify-center mb-10">
            <TrustIndicator />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Browse Catalog
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Create Wholesale Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact hero for internal pages
interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ title, subtitle, className = "" }: PageHeroProps) {
  return (
    <section
      className={`bg-linear-to-b from-base-200 to-base-100 py-12 md:py-16 ${className}`}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base-content/60 mt-2 text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

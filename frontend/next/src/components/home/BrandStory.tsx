"use client";

import { TrustBadges, QualityBadges } from "@/components/ui/TrustBadges";
import { BRAND, PRODUCT_SPECS } from "@/lib/constants";

interface BrandStoryProps {
  className?: string;
}

export function BrandStory({ className = "" }: BrandStoryProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
              Handcrafted with Care
              <span className="block text-primary">Since {BRAND.established}</span>
            </h2>

            <div className="space-y-4 text-base-content/70 leading-relaxed">
              <p>
                Lucky Bee Press has been creating beautiful letterpress greeting cards 
                for over {BRAND.yearsInBusiness} years. Each card is printed using 
                traditional letterpress techniques with hand-mixed inks that give our 
                cards their distinctive, tactile quality.
              </p>
              <p>
                We use only premium 100% cotton cardstock for a luxurious feel that your 
                customers will notice immediately. Every card comes with a recycled 
                envelope, because we believe in creating beautiful products responsibly.
              </p>
              <p>
                Our wholesale program gives retailers and boutiques direct access to our 
                complete collection at competitive prices, with flexible payment terms 
                for established accounts.
              </p>
            </div>

            {/* Quality badges */}
            <div className="mt-8">
              <QualityBadges />
            </div>
          </div>

          {/* Stats/Trust */}
          <div className="bg-base-200/50 rounded-3xl p-8 md:p-12">
            <h3 className="text-xl font-semibold mb-8 text-center">
              Trusted by Retailers Nationwide
            </h3>
            <TrustBadges variant="grid" size="lg" showAll />

            {/* Product specs */}
            <div className="mt-10 pt-8 border-t border-base-300">
              <h4 className="font-semibold mb-4">Product Specifications</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-base-content/60">Card Size</p>
                  <p className="font-medium">{PRODUCT_SPECS.cardSize}</p>
                </div>
                <div>
                  <p className="text-base-content/60">Material</p>
                  <p className="font-medium">{PRODUCT_SPECS.material}</p>
                </div>
                <div>
                  <p className="text-base-content/60">Printing</p>
                  <p className="font-medium">Letterpress</p>
                </div>
                <div>
                  <p className="text-base-content/60">Envelope</p>
                  <p className="font-medium">Recycled included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact about section
export function AboutBanner({ className = "" }: { className?: string }) {
  return (
    <section className={`py-8 bg-primary/5 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <p className="text-base-content/70">
            <span className="font-semibold text-base-content">{BRAND.name}</span>
            {" "}— {BRAND.yearsInBusiness}+ years of artisan letterpress printing
          </p>
          <div className="hidden md:block h-4 w-px bg-base-300" />
          <p className="text-base-content/70">
            {PRODUCT_SPECS.material} • Hand-mixed inks • Recycled envelopes
          </p>
        </div>
      </div>
    </section>
  );
}


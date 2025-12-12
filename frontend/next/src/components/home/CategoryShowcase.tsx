"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useCategories } from "@/hooks/useProducts";

interface CategoryShowcaseProps {
  className?: string;
}

// Category images/colors - in production these would come from CMS
const categoryStyles: Record<string, { gradient: string; emoji: string }> = {
  Birthday: { gradient: "from-pink-500/20 to-purple-500/20", emoji: "🎂" },
  "Thank You": { gradient: "from-teal-500/20 to-cyan-500/20", emoji: "💝" },
  Holiday: { gradient: "from-red-500/20 to-green-500/20", emoji: "🎄" },
  Wedding: { gradient: "from-rose-500/20 to-pink-500/20", emoji: "💒" },
  Baby: { gradient: "from-blue-500/20 to-indigo-500/20", emoji: "👶" },
  Love: { gradient: "from-red-500/20 to-pink-500/20", emoji: "❤️" },
  Sympathy: { gradient: "from-slate-500/20 to-gray-500/20", emoji: "🕊️" },
  Congratulations: {
    gradient: "from-yellow-500/20 to-orange-500/20",
    emoji: "🎉",
  },
  Friendship: { gradient: "from-amber-500/20 to-yellow-500/20", emoji: "🤝" },
  "Just Because": {
    gradient: "from-violet-500/20 to-purple-500/20",
    emoji: "✨",
  },
  Graduation: { gradient: "from-blue-500/20 to-cyan-500/20", emoji: "🎓" },
  "New Home": { gradient: "from-emerald-500/20 to-teal-500/20", emoji: "🏠" },
};

export function CategoryShowcase({ className = "" }: CategoryShowcaseProps) {
  // Show featured categories
  const { categories, loading } = useCategories();
  const featuredCategories = loading ? [] : categories.splice(0, 6);
  return (
    <section className={`py-12 md:py-16 bg-base-200/50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content">
            Shop by Category
          </h2>
          <p className="text-base-content/60 mt-2">
            Find the perfect cards for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((category) => {
            const style = categoryStyles[category] || {
              gradient: "from-gray-500/20 to-slate-500/20",
              emoji: "📝",
            };

            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
              >
                <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-3xl">{style.emoji}</span>
                    </div>
                    <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Compact category pills for filter bar
export function CategoryPills({ className = "" }: { className?: string }) {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-full bg-base-200 animate-pulse w-24 h-9"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/products?category=${encodeURIComponent(category)}`}
          className="px-4 py-2 rounded-full bg-base-200 hover:bg-primary hover:text-primary-content transition-colors text-sm font-medium"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

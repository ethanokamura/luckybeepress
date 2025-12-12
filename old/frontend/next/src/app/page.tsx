"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Card, CardContent } from "@/components/ui";
import { mockProducts, getCategories } from "@/lib/mock-data";
import { ProductCard } from "@/components/product";
import {
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiAward,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

export default function Home() {
  const { user } = useUser();
  const featuredProducts = mockProducts
    .sort((a, b) => a.created_at!.getTime() - b.created_at!.getTime())
    .slice(0, 4);
  const categories = getCategories().sort((a, b) => a.localeCompare(b));

  const benefits = [
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Wholesale Pricing",
      description:
        "Competitive wholesale prices with volume discounts for larger orders.",
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: "Quality Craftsmanship",
      description:
        "100% cotton paper, deep letterpress impressions, and meticulous attention to detail.",
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: "Reliable Shipping",
      description:
        "Fast, reliable shipping with tracking. Free shipping on orders over $500.",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Exclusive Designs",
      description: "Original, hand-drawn designs you won't find anywhere else.",
    },
  ];

  const features = [
    {
      icon: <FiCheckCircle className="w-5 h-5 text-success" />,
      text: "Low minimum order quantities",
    },
    {
      icon: <FiCheckCircle className="w-5 h-5 text-success" />,
      text: "Regular new releases and seasonal collections",
    },
    {
      icon: <FiCheckCircle className="w-5 h-5 text-success" />,
      text: "Dedicated wholesale support team",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-base-100 to-base-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral font-serif mb-4">
                Premium Letterpress Cards for Your Store
              </h1>
              <p className="text-xl text-base-content mb-8 leading-relaxed">
                Handcrafted letterpress greeting cards that your customers will
                love. Wholesale pricing for independent retailers.
              </p>

              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/api/auth/login?screen_hint=signup">
                    <Button variant="primary" size="lg">
                      Open Wholesale Account
                    </Button>
                  </a>
                  <Link href="/products">
                    <Button variant="outline" size="lg">
                      Browse Catalog
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    Shop Wholesale
                  </Button>
                </Link>
              )}
            </div>

            <div className="relative">
              <Card className="p-8 bg-base-100 shadow-2xl">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {feature.icon}
                      <span className="text-base-content">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral font-serif mb-4">
              Why Retailers Choose Lucky Bee Press
            </h2>
            <p className="text-lg text-base-content max-w-2xl mx-auto">
              We make it easy and profitable to stock high-quality, artisan
              greeting cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center" hover>
                <CardContent>
                  <div className="flex justify-center text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-base-content">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral font-serif mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-base-content">
                Check out our newest products
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPricing={!!user}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral font-serif mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-base-content">
              Cards for every occasion your customers need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category} href={`/products?category=${category}`}>
                <Card hover className="text-center h-full">
                  <CardContent>
                    <FiPackage className="w-12 h-12 mx-auto text-primary mb-3" />
                    <h3 className="font-semibold text-neutral">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-neutral text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FiShield className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Ready to Stock Quality Cards?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Open your wholesale account today. No application fees, flexible
              payment terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/api/auth/login?screen_hint=signup">
                <Button variant="primary" size="lg">
                  Create Wholesale Account
                </Button>
              </a>
              <a href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white! border-white! hover:bg-base-100! hover:text-neutral!"
                >
                  Contact Sales
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

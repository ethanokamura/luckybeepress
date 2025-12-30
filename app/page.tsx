"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { collections, formatPrice } from "@/lib/firebase-helpers";
import { Navbar } from "@/components/shared/Navbar";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types";

export default function HomePage() {
  const { firebaseUser, isApproved, loading } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collections.products,
          where("status", "==", "active"),
          where("featured", "==", true),
          limit(4)
        );
        const snapshot = await getDocs(q);
        setFeaturedProducts(snapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden honeycomb-pattern h-full">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="/tag.png"
              alt="Lucky Bee Press"
              width={512}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">Lucky Bee Press</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Artisan letterpress greeting cards, crafted with hand-mixed inks
              on 100% cotton cardstock. Wholesale orders for boutiques and
              retail stores.
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="text-primary">★</span>
                5-Star Rating (2,000+ Reviews)
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                17+ Years in Business
              </span>
              <span className="flex items-center gap-2">
                <span className="text-primary">♻</span>
                Eco-Friendly Materials
              </span>
            </div>

            {/* CTA */}
            <div className="mt-10 flex items-center justify-center gap-4">
              {loading ? (
                <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
              ) : firebaseUser ? (
                isApproved ? (
                  <Link href="/products">
                    <Button size="lg">Browse Products</Button>
                  </Link>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Your account is pending approval. We&apos;ll notify you
                      once you&apos;re approved!
                    </p>
                    <Link href="/account">
                      <Button variant="outline">View Account Status</Button>
                    </Link>
                  </div>
                )
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg">Apply for Wholesale</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

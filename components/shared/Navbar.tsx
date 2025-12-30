"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onSnapshot, query, where, limit } from "firebase/firestore";
import { collections } from "@/lib/firebase-helpers";
import type { Cart } from "@/types";
import Image from "next/image";

export function Navbar() {
  const { firebaseUser, userData, loading, isApproved, isAdmin, mounted } =
    useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  // Prevent hydration mismatch by showing consistent loading state until mounted
  const isLoading = !mounted || loading;

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const q = query(
      collections.carts,
      where("userId", "==", firebaseUser.uid),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cart = snapshot.docs[0].data() as Cart;
        setCartCount(cart.itemCount || 0);
      } else {
        setCartCount(0);
      }
    });

    return () => {
      unsubscribe();
      setCartCount(0);
    };
  }, [firebaseUser]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light.svg"
              alt="Lucky Bee Press"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-foreground">
              LuckyBeePress
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {mounted && isApproved && (
              <>
                <Link
                  href="/products"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/orders"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Orders
                </Link>
              </>
            )}
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : firebaseUser ? (
              <>
                {isApproved && (
                  <Link href="/cart" className="relative">
                    <Button variant="ghost" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                      </svg>
                    </Button>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}

                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    {userData?.displayName || "Account"}
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

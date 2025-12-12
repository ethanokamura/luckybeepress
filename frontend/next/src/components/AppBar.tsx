"use client";

import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import { useDrawer } from "@/providers/DrawerProvider";
import {
  Moon,
  Sun,
  Menu,
  LogIn,
  LogOut,
  User,
  Package,
} from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";
import { CartButton } from "@/components/cart/CartButton";
import * as config from "@/lib/constants";
import Image from "next/image";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/products?category=Birthday", label: "Birthday" },
  { href: "/products?category=Holiday", label: "Holiday" },
];

export default function AppBar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleDrawer } = useDrawer();
  const { user, isLoading } = useUser();

  return (
    <header className="fixed shadow-md w-screen top-0 left-0 right-0 z-50 px-4 md:px-10 py-4 bg-base-100 border-b border-base-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDrawer}
            className="p-2 rounded-lg hover:bg-base-200 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-base-content" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-content font-bold text-sm">LB</span>
            </div>
            <span className="text-xl font-bold text-base-content hidden sm:block">
              {config.title}
            </span>
          </Link>
        </div>

        {/* Center - Navigation (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-base-200 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-base-content/70" />
            ) : (
              <Sun className="w-5 h-5 text-base-content/70" />
            )}
          </button>

          {/* Cart Button */}
          <CartButton showBadge showMinimumStatus={false} />

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-base-200 animate-pulse" />
          ) : user ? (
            <>
              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 rounded-lg hover:bg-base-200 transition-colors hidden md:flex"
                aria-label="Account"
              >
                <Package className="w-5 h-5 text-base-content/70" />
              </Link>

              {/* User Menu */}
              <Link
                href="/account/settings"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-base-200 transition-colors"
              >
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name || "Profile"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </Link>

              {/* Logout */}
              <Link
                href="/auth/logout"
                className="p-2 rounded-lg hover:bg-base-200 transition-colors hidden md:flex"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5 text-base-content/70" />
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:block">Log In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import { BRAND } from "@/lib/constants";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=Birthday", label: "Birthday Cards" },
    { href: "/products?category=Holiday", label: "Holiday Cards" },
    { href: "/products?category=Thank+You", label: "Thank You Cards" },
  ],
  account: [
    { href: "/auth/login", label: "Sign In" },
    { href: "/account", label: "My Account" },
    { href: "/account/orders", label: "Order History" },
    { href: "/cart", label: "Cart" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/wholesale", label: "Wholesale Info" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-content font-bold">LB</span>
              </div>
              <span className="text-xl font-bold text-base-content">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-base-content/60 mb-4 max-w-sm">
              {BRAND.tagline}. Premium letterpress greeting cards for retailers
              and boutiques since {BRAND.established}.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:wholesale@luckybeepress.com"
                className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                wholesale@luckybeepress.com
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                (555) 123-4567
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base-content/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base-content/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base-content/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-base-content/50">
            © {currentYear} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/luckybeepress"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-base-300 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-base-content/60" />
            </a>
            <a
              href="https://facebook.com/luckybeepress"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-base-300 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-base-content/60" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


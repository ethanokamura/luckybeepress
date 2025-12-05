import Link from "next/link";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-serif mb-3">
              Lucky Bee Press
            </h3>
            <p className="text-gray-300 text-sm mb-4 max-w-md">
              Premium letterpress greeting cards for independent retailers.
              Handcrafted with care, designed to delight your customers.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-primary" />
                <a
                  href="mailto:wholesale@luckybeepress.com"
                  className="hover:text-primary transition-colors"
                >
                  wholesale@luckybeepress.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-primary" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-primary transition-colors"
                >
                  (831) 419-0778
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Santa Cruz, California</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Birthday"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Birthday Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Holiday"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Holiday Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Wedding"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Wedding & Anniversary
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/account"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Lucky Bee Press. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/wholesale-terms"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Wholesale Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

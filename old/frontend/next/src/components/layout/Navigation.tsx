"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoginButton from "../LoginButton";
import { HiMenuAlt2 } from "react-icons/hi";
import { useDrawer } from "@/providers/DrawerProvider";

export function Navigation() {
  const { toggleDrawer } = useDrawer();
  const { isLoading } = useUser();

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-screen top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center h-20">
          {/* Mobile Menu Button */}
          <button
            className="text-base-content/70 hover:bg-base-200"
            onClick={toggleDrawer}
          >
            <HiMenuAlt2 size={24} />
          </button>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="ml-3">
              <h1 className="text-xl font-bold text-neutral font-serif">
                Lucky Bee Press
              </h1>
              <p className="sm:block hidden text-xs text-base-content/70">
                Wholesale Portal
              </p>
            </div>
          </Link>
        </div>

        {!isLoading && <LoginButton />}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDrawer } from "@/providers/DrawerProvider";
import { useUser } from "@auth0/nextjs-auth0";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, ElementType } from "react";
import {
  X,
  Home,
  Package,
  ShoppingCart,
  User,
  MapPin,
  Settings,
  LogIn,
  LogOut,
  FileText,
  Gift,
  Heart,
  Cake,
} from "lucide-react";
import Image from "next/image";

interface NavigationItem {
  href: string;
  label: string;
  icon: ElementType;
  protected?: boolean;
}

interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/products", label: "All Products", icon: Package },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/cart", label: "Cart", icon: ShoppingCart },
      { href: "/account", label: "Dashboard", icon: User, protected: true },
      {
        href: "/account/orders",
        label: "Orders",
        icon: FileText,
        protected: true,
      },
      {
        href: "/account/addresses",
        label: "Addresses",
        icon: MapPin,
        protected: true,
      },
      {
        href: "/account/settings",
        label: "Settings",
        icon: Settings,
        protected: true,
      },
    ],
  },
];

export default function AppDrawer() {
  const { isOpen, toggleDrawer } = useDrawer();
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={toggleDrawer}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        {/* Drawer Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-80 max-w-full">
                  <div className="flex h-full flex-col bg-base-100 shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                      <DialogTitle className="text-lg font-semibold text-base-content">
                        Menu
                      </DialogTitle>
                      <button
                        onClick={toggleDrawer}
                        className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5 text-base-content/70" />
                      </button>
                    </div>

                    {/* User Info */}
                    {user && (
                      <div className="px-6 py-4 border-b border-base-300">
                        <div className="flex items-center gap-3">
                          {user.picture ? (
                            <Image
                              src={user.picture}
                              alt={user.name || "Profile"}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-base-content truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-base-content/60 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-4">
                      {navigationSections.map((section, sectionIdx) => {
                        const visibleItems = section.items.filter(
                          (item) => !item.protected || (item.protected && user)
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                          <div key={sectionIdx} className="mb-6 last:mb-0">
                            {section.title && (
                              <h3 className="px-4 mb-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                                {section.title}
                              </h3>
                            )}
                            <ul className="space-y-1">
                              {visibleItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                  pathname === item.href ||
                                  (item.href !== "/" &&
                                    pathname.startsWith(
                                      item.href.split("?")[0]
                                    ));
                                return (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      onClick={toggleDrawer}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                      }`}
                                    >
                                      <Icon className="w-5 h-5" />
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="px-4 py-4 border-t border-base-300">
                      {user ? (
                        <Link
                          href="/auth/logout"
                          onClick={toggleDrawer}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Log Out</span>
                        </Link>
                      ) : (
                        <Link
                          href="/auth/login"
                          onClick={toggleDrawer}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-content hover:opacity-90 transition-opacity"
                        >
                          <LogIn className="w-5 h-5" />
                          <span className="font-medium">Log In</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

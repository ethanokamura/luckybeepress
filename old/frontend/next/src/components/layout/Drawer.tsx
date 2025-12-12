"use client";
import Link from "next/link";
import { useDrawer } from "@/providers/DrawerProvider";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useCart } from "@/lib/cart-context";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiHome,
  FiGrid,
} from "react-icons/fi";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/Badge";

export default function Drawer() {
  const pathname = usePathname();
  const { isOpen, toggleDrawer } = useDrawer();
  const { user, isLoading } = useUser();
  const { getTotalItems } = useCart();

  const isActive = (path: string) => pathname === path;

  const cartItemCount = getTotalItems();

  const navLinks = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/products", label: "Products", icon: FiGrid },
  ];

  const authenticatedLinks = [
    { href: "/account", label: "Account", icon: FiUser, badge: null },
    { href: "/orders", label: "Orders", icon: FiPackage, badge: null },
    {
      href: "/cart",
      label: "Cart",
      icon: FiShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
  ];

  return (
    <div>
      <Dialog open={isOpen} onClose={toggleDrawer} className="relative z-10000">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xs transform transition duration-300 ease-in-out data-closed:-translate-x-full"
              >
                <div className="relative flex h-full flex-col overflow-y-auto py-6 shadow-xl bg-base-100">
                  <div className="relative mt-6 flex-1 ">
                    <div className="flex flex-col gap-2 pb-6 px-6">
                      <h1 className="text-2xl font-bold">Lucky Bee Press</h1>
                      <h2 className="text-sm text-base-content/70">
                        Wholesale Portal
                      </h2>
                    </div>
                    <div className="flex flex-col gap-2 px-6 text-base-content/70 text-3xl">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive(link.href)
                          ? "bg-base-200 text-neutral"
                          : "text-base-content hover:bg-base-200"
                      }
                    `}
                            onClick={toggleDrawer}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}

                      {user &&
                        authenticatedLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive(link.href)
                          ? "bg-base-200 text-neutral"
                          : "text-base-content hover:bg-base-200"
                      }
                    `}
                              onClick={toggleDrawer}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{link.label}</span>
                              {link.badge !== null && link.badge > 0 && (
                                <Badge variant="primary" size="sm">
                                  {link.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

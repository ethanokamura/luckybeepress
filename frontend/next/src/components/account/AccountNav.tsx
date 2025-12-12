"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

interface AccountNavProps {
  className?: string;
}

export function AccountNav({ className = "" }: AccountNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === "/account";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Logout link */}
      <a
        href="/auth/logout"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors mt-4"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Sign Out</span>
      </a>
    </nav>
  );
}

// Mobile account tabs
export function AccountTabs({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === "/account";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              active
                ? "bg-primary text-primary-content"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}


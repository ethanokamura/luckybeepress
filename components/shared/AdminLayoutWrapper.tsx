"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AuthGuard } from "./AuthGuard";

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🏷️" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();

  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-background">
        {/* Admin Header */}
        <header className="sticky top-0 z-50 border-b bg-card">
          <div className="flex h-14 items-center px-6">
            <Link href="/admin" className="flex items-center gap-2 mr-8">
              <span className="text-xl">🐝</span>
              <span className="font-bold">Admin</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="ml-auto">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}

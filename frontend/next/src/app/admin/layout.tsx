"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { AdminNav, AdminTabs } from "@/components/admin/AdminNav";
import { useAdminCheck } from "@/hooks/useAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdmin, loading } = useAdminCheck();

  useEffect(() => {
    if (!loading && !isAdmin) {
      // Redirect non-admin users
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Verifying access...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-error" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-base-content/60">
            You don&apos;t have permission to access the admin area.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile tabs */}
        <div className="lg:hidden mb-6">
          <AdminTabs />
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-base-100 rounded-xl p-4 border border-base-300">
              <div className="mb-4 pb-4 border-b border-base-300">
                <h2 className="text-lg font-bold text-base-content">Admin Panel</h2>
                <p className="text-sm text-base-content/60">Lucky Bee Press</p>
              </div>
              <AdminNav />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Customer dashboard redirects to appropriate page based on status
export default function DashboardPage() {
  const { firebaseUser, isApproved, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser) {
      router.push("/login");
    } else if (isApproved) {
      router.push("/products");
    } else {
      router.push("/account");
    }
  }, [firebaseUser, isApproved, loading, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-4xl animate-bounce">🐝</div>
    </div>
  );
}


"use client";

import Link from "next/link";

export default function LogoutButton() {
  return (
    <Link
      href="/auth/logout"
      className="hidden sm:block px-5 py-2.5 text-sm font-medium bg-transparent 
        border border-base-300 rounded-lg transition-all duration-300
        hover:bg-primary hover:text-base-100 hover:border-primary 
        hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(125,196,255,0.3)]"
    >
      Log Out
    </Link>
  );
}

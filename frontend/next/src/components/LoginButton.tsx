"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

import Image from "next/image";
import Link from "next/link";

export default function LoginButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>💀</div>;
  }

  if (user) {
    return (
      <Link href={`/dashboard`}>
        <Image
          className="rounded-full"
          src={user?.picture ?? "/logo.svg"}
          alt={user.name || "User profile"}
          width={32}
          height={32}
        />
      </Link>
    );
  }
  return <Link href="/auth/login">Log In</Link>;
}

"use client";

import LoginButton from "./LoginButton";
import Link from "next/link";
import { useTheme } from "../providers/ThemeProvider";
import { useDrawer } from "../providers/DrawerProvider";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import LogoutButton from "./LogoutButton";
import { useUser } from "@auth0/nextjs-auth0";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleDrawer } = useDrawer();
  const { user } = useUser();
  return (
    <header className="fixed shadow-md w-screen top-0 left-0 right-0 z-10 px-10 py-6 bg-base-100">
      <div className="flex items-center">
        <button onClick={toggleDrawer}>
          <HiMenuAlt2 size={24} />
        </button>
        <div className="mx-4">
          <Link href="/" className="text-xl font-semibold">
            BentoLabs
          </Link>
        </div>
        <div className="w-full flex justify-end items-center gap-4">
          <button className="text-base-content/70" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <LoginButton />
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}

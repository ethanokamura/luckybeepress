// components/layout/AppDrawer/AppDrawer.tsx
"use client";
import Link from "next/link";
import { useDrawer } from "@/providers/DrawerProvider";

export default function AppDrawer() {
  const { isOpen, toggleDrawer } = useDrawer();
  return (
    <div className="drawer" onClick={toggleDrawer}>
      <input
        id="my-drawer-1"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={toggleDrawer}
      />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-100 min-h-full w-60 p-4 pt-20">
          <li>
            <Link href={"/"} className="text-2xl">
              Home
            </Link>
          </li>
          <li>
            <Link href={"/contact"} className="text-2xl">
              Contact
            </Link>
          </li>
          <li>
            <Link href={"/customers"} className="text-2xl">
              Customers
            </Link>
          </li>
          <li>
            <Link href={"/addresses"} className="text-2xl">
              Addresses
            </Link>
          </li>
          <li>
            <Link href={"/products"} className="text-2xl">
              Products
            </Link>
          </li>
          <li>
            <Link href={"/carts"} className="text-2xl">
              Carts
            </Link>
          </li>
          <li>
            <Link href={"/cart-items"} className="text-2xl">
              CartItems
            </Link>
          </li>
          <li>
            <Link href={"/orders"} className="text-2xl">
              Orders
            </Link>
          </li>
          <li>
            <Link href={"/order-items"} className="text-2xl">
              OrderItems
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

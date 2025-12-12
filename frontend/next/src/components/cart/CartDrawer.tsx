"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CartItem, CartItemSkeleton } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useCartContext } from "@/providers/CartProvider";

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    items,
    totals,
    loading,
    itemLoading,
    incrementItem,
    decrementItem,
    removeItem,
    canCheckout,
    checkoutBlockReason,
  } = useCartContext();

  return (
    <Transition show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-base-100 shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                      <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Your Cart
                        {items.length > 0 && (
                          <span className="text-sm font-normal text-base-content/60">
                            ({items.length}{" "}
                            {items.length === 1 ? "item" : "items"})
                          </span>
                        )}
                      </DialogTitle>
                      <button
                        onClick={closeCart}
                        className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {loading ? (
                        <div className="px-6 py-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <CartItemSkeleton key={i} />
                          ))}
                        </div>
                      ) : items.length === 0 ? (
                        <EmptyCart
                          onBrowse={() => {
                            closeCart();
                            window.location.href = "/products";
                          }}
                          className="py-12"
                        />
                      ) : (
                        <div className="px-6 py-4">
                          {items.map((item) => (
                            <CartItem
                              key={item.id}
                              item={item}
                              onIncrement={() =>
                                item.id && incrementItem(item.id)
                              }
                              onDecrement={() =>
                                item.id && decrementItem(item.id)
                              }
                              onRemove={() => item.id && removeItem(item.id)}
                              loading={itemLoading === item.id}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-base-300 px-6 py-4 space-y-4">
                        <CartSummary totals={totals} compact />

                        {/* Checkout blocked message */}
                        {!canCheckout && checkoutBlockReason && (
                          <p className="text-sm text-warning text-center">
                            {checkoutBlockReason}
                          </p>
                        )}

                        {/* Action buttons */}
                        <div className="space-y-2">
                          <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            disabled={!canCheckout}
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                            onClick={() => {
                              closeCart();
                              window.location.href = "/checkout";
                            }}
                          >
                            Checkout
                          </Button>

                          <Link
                            href="/cart"
                            onClick={closeCart}
                            className="block w-full text-center py-2 text-sm text-primary hover:underline"
                          >
                            View Full Cart
                          </Link>
                        </div>
                      </div>
                    )}
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

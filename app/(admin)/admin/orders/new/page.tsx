"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import {
  collections,
  formatPrice,
  NEW_CUSTOMER_MIN_ORDER,
  REPEAT_CUSTOMER_MIN_ORDER,
  SHIPPING_FEE_CENTS,
} from "@/lib/firebase-helpers";
import { searchProducts, AlgoliaProductHit } from "@/lib/algolia";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search, Trash2, X } from "lucide-react";
import type { User, OrderAddress, OrderItem } from "@/types";
import { WHOLESALE_PRICING } from "@/types/products";

// ─── Local types ────────────────────────────────────────────────────────────

interface OrderLine {
  lineId: string;
  productId: string;
  name: string;
  sku: string | null;
  image: string | null;
  wholesalePrice: number;
  hasBoxOption: boolean;
  boxWholesalePrice: number | null;
  isBox: boolean;
  quantity: number;
}

type AddressState = {
  firstName: string;
  lastName: string;
  company: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function emptyAddress(): AddressState {
  return {
    firstName: "",
    lastName: "",
    company: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  };
}

function toOrderAddress(addr: AddressState): OrderAddress {
  return {
    firstName: addr.firstName,
    lastName: addr.lastName,
    company: addr.company || null,
    street1: addr.street1,
    street2: addr.street2 || null,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    phone: addr.phone || null,
  };
}

function linePrice(line: OrderLine): number {
  return line.isBox ? (line.boxWholesalePrice ?? 0) : line.wholesalePrice;
}

function lineTotal(line: OrderLine): number {
  return linePrice(line) * line.quantity;
}

function minQty(isBox: boolean): number {
  return isBox ? WHOLESALE_PRICING.BOX_MIN_QTY : WHOLESALE_PRICING.SINGLE_MIN_QTY;
}

function isValidQty(qty: number, isBox: boolean): boolean {
  const step = minQty(isBox);
  return qty >= step && qty % step === 0;
}

// ─── Address section ─────────────────────────────────────────────────────────

function AddressFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: AddressState;
  onChange: (field: keyof AddressState, val: string) => void;
}) {
  const input = (
    field: keyof AddressState,
    placeholder: string,
    required = false,
    type = "text"
  ) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value[field]}
      onChange={(e) => onChange(field, e.target.value)}
      required={required}
      className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
    />
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{label}</h3>
      <div className="grid grid-cols-2 gap-3">
        {input("firstName", "First name *", true)}
        {input("lastName", "Last name *", true)}
      </div>
      {input("company", "Company / Business name")}
      {input("street1", "Street address *", true)}
      {input("street2", "Apt, suite, etc.")}
      <div className="grid grid-cols-2 gap-3">
        {input("city", "City *", true)}
        {input("state", "State *", true)}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {input("postalCode", "Postal code *", true)}
        <select
          value={value.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
      </div>
      {input("phone", "Phone", false, "tel")}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminNewOrderPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  // Customer
  const [allCustomers, setAllCustomers] = useState<User[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Product search
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState<AlgoliaProductHit[]>([]);
  const [productSearching, setProductSearching] = useState(false);
  const productSearchRef = useRef<NodeJS.Timeout | null>(null);

  // Order lines
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  // Addresses
  const [shippingAddr, setShippingAddr] = useState<AddressState>(emptyAddress());
  const [billingAddr, setBillingAddr] = useState<AddressState>(emptyAddress());
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Order details
  const [paymentTerms, setPaymentTerms] = useState<"card" | "net30">("card");
  const [notes, setNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [overrideMinimum, setOverrideMinimum] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Load all active customers on mount ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(
          query(
            collections.users,
            where("accountStatus", "==", "active"),
            where("role", "==", "customer"),
            orderBy("displayName", "asc")
          )
        );
        setAllCustomers(snap.docs.map((d) => d.data()));
      } catch (e) {
        console.error("Error loading customers:", e);
      }
    };
    load();
  }, []);

  // ── Filtered customer list ───────────────────────────────────────────────
  const filteredCustomers = customerSearch.trim()
    ? allCustomers.filter((c) => {
        const q = customerSearch.toLowerCase();
        return (
          c.email.toLowerCase().includes(q) ||
          (c.displayName || "").toLowerCase().includes(q)
        );
      })
    : [];

  // ── Product search (debounced Algolia) ───────────────────────────────────
  const performProductSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setProductResults([]);
      return;
    }
    setProductSearching(true);
    try {
      const result = await searchProducts(q, {
        hitsPerPage: 8,
        filters: "status:active",
      });
      setProductResults(result.hits);
    } catch {
      setProductResults([]);
    } finally {
      setProductSearching(false);
    }
  }, []);

  useEffect(() => {
    if (productSearchRef.current) clearTimeout(productSearchRef.current);
    if (productQuery.trim()) {
      setProductSearching(true);
      productSearchRef.current = setTimeout(() => {
        performProductSearch(productQuery);
      }, 300);
    } else {
      setProductResults([]);
      setProductSearching(false);
    }
    return () => {
      if (productSearchRef.current) clearTimeout(productSearchRef.current);
    };
  }, [productQuery, performProductSearch]);

  // ── Add product line ─────────────────────────────────────────────────────
  const addLine = (hit: AlgoliaProductHit, isBox: boolean) => {
    const existingIdx = orderLines.findIndex(
      (l) => l.productId === hit.objectID && l.isBox === isBox
    );
    if (existingIdx !== -1) {
      // Increment by min qty
      const step = minQty(isBox);
      setOrderLines((prev) =>
        prev.map((l, i) =>
          i === existingIdx ? { ...l, quantity: l.quantity + step } : l
        )
      );
    } else {
      const qty = minQty(isBox);
      setOrderLines((prev) => [
        ...prev,
        {
          lineId: `${hit.objectID}-${isBox ? "box" : "single"}-${Date.now()}`,
          productId: hit.objectID,
          name: hit.name,
          sku: hit.sku ?? null,
          image: hit.images?.[0] ?? null,
          wholesalePrice: hit.wholesalePrice ?? 0,
          hasBoxOption: hit.hasBoxOption ?? false,
          boxWholesalePrice: hit.boxWholesalePrice ?? null,
          isBox,
          quantity: qty,
        },
      ]);
    }
    setProductQuery("");
    setProductResults([]);
  };

  const removeLine = (lineId: string) => {
    setOrderLines((prev) => prev.filter((l) => l.lineId !== lineId));
  };

  const updateQty = (lineId: string, raw: string) => {
    const qty = parseInt(raw, 10);
    if (isNaN(qty) || qty < 1) return;
    setOrderLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity: qty } : l))
    );
  };

  const handleAddrChange = (
    which: "shipping" | "billing",
    field: keyof AddressState,
    val: string
  ) => {
    if (which === "shipping") setShippingAddr((p) => ({ ...p, [field]: val }));
    else setBillingAddr((p) => ({ ...p, [field]: val }));
  };

  // ── Computed ─────────────────────────────────────────────────────────────
  const subtotal = orderLines.reduce((s, l) => s + lineTotal(l), 0);
  const total = subtotal + SHIPPING_FEE_CENTS;
  const minOrder = selectedCustomer?.isRepeatCustomer
    ? REPEAT_CUSTOMER_MIN_ORDER
    : NEW_CUSTOMER_MIN_ORDER;
  const belowMinimum = subtotal < minOrder;

  const qtyErrors = orderLines.filter((l) => !isValidQty(l.quantity, l.isBox));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCustomer) return setError("Select a customer.");
    if (orderLines.length === 0) return setError("Add at least one product.");
    if (qtyErrors.length > 0) {
      return setError(
        `Invalid quantity for: ${qtyErrors.map((l) => l.name).join(", ")}. Singles must be multiples of 6, boxes multiples of 4.`
      );
    }
    if (!shippingAddr.firstName || !shippingAddr.street1 || !shippingAddr.city) {
      return setError("Complete the shipping address.");
    }
    if (belowMinimum && !overrideMinimum) {
      return setError(
        `Subtotal ${formatPrice(subtotal)} is below the ${formatPrice(minOrder)} minimum. Check the override box to proceed.`
      );
    }
    if (overrideMinimum && !overrideReason.trim()) {
      return setError("Provide a reason for the minimum order override.");
    }

    const orderItems: OrderItem[] = orderLines.map((l) => ({
      productId: l.productId,
      variantId: null,
      name: l.name + (l.isBox ? " (Box)" : ""),
      sku: l.sku,
      image: l.image,
      price: linePrice(l),
      quantity: l.quantity,
      total: lineTotal(l),
    }));

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          customerEmail: selectedCustomer.email,
          customerDisplayName: selectedCustomer.displayName,
          items: orderItems,
          shippingAddress: toOrderAddress(shippingAddr),
          billingAddress: sameAsShipping
            ? toOrderAddress(shippingAddr)
            : toOrderAddress(billingAddr),
          paymentTerms,
          notes,
          adminNotes,
          overrideReason: overrideMinimum ? overrideReason : null,
          subtotal,
          discount: 0,
          adminEmail: firebaseUser?.email || "admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      router.push(`/admin/orders/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order.");
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground mb-1"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold">New Order</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create an order on behalf of a customer
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── 1. Customer ─────────────────────────────────────────────────── */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">1. Customer</h2>

          {selectedCustomer ? (
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
              <div>
                <p className="font-medium">
                  {selectedCustomer.displayName || selectedCustomer.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      selectedCustomer.isRepeatCustomer
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedCustomer.isRepeatCustomer
                      ? "Repeat Customer"
                      : "New Customer"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Min. order: {formatPrice(minOrder)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-10"
              />
              {filteredCustomers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded-lg shadow-lg overflow-hidden">
                  {filteredCustomers.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch("");
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 text-left text-sm"
                    >
                      <span>
                        <span className="font-medium">
                          {c.displayName || c.email}
                        </span>
                        {c.displayName && (
                          <span className="text-muted-foreground ml-2">
                            {c.email}
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ml-2 shrink-0 ${
                          c.isRepeatCustomer
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {c.isRepeatCustomer ? "Repeat" : "New"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {customerSearch.trim() && filteredCustomers.length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  No active customers found.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── 2. Products ─────────────────────────────────────────────────── */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">2. Products</h2>

          {/* Product search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {productQuery && (
              <button
                type="button"
                onClick={() => {
                  setProductQuery("");
                  setProductResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results */}
          {(productSearching || productResults.length > 0) && (
            <div className="border rounded-lg overflow-hidden">
              {productSearching ? (
                <div className="p-3 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : (
                productResults.map((hit) => (
                  <div
                    key={hit.objectID}
                    className="flex items-center gap-3 p-3 border-b last:border-0 hover:bg-muted/30"
                  >
                    <div className="relative w-10 h-10 rounded bg-muted overflow-hidden shrink-0">
                      {hit.images?.[0] ? (
                        <Image
                          src={hit.images[0]}
                          alt={hit.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src="/logo.svg"
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{hit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hit.sku} · {hit.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addLine(hit, false)}
                        className="text-xs"
                      >
                        + Singles ({formatPrice(hit.wholesalePrice ?? 0)}/ea)
                      </Button>
                      {hit.hasBoxOption && hit.boxWholesalePrice && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addLine(hit, true)}
                          className="text-xs"
                        >
                          + Box ({formatPrice(hit.boxWholesalePrice)}/box)
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Order lines */}
          {orderLines.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-center p-3 font-medium w-28">Qty</th>
                    <th className="text-right p-3 font-medium">Unit</th>
                    <th className="text-right p-3 font-medium">Total</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orderLines.map((line) => {
                    const invalid = !isValidQty(line.quantity, line.isBox);
                    const step = minQty(line.isBox);
                    return (
                      <tr key={line.lineId} className={invalid ? "bg-red-50 dark:bg-red-950/20" : ""}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {line.image && (
                              <div className="relative w-8 h-8 rounded bg-muted overflow-hidden shrink-0">
                                <Image
                                  src={line.image}
                                  alt={line.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{line.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {line.isBox ? "Box Sets" : "Singles"} · min {step}
                                {line.sku ? ` · ${line.sku}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={step}
                            step={step}
                            value={line.quantity}
                            onChange={(e) => updateQty(line.lineId, e.target.value)}
                            className={`w-20 text-center px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                              invalid
                                ? "border-red-400 bg-red-50 dark:bg-red-950/40"
                                : "bg-background"
                            }`}
                          />
                          {invalid && (
                            <p className="text-xs text-red-600 mt-0.5">
                              Must be multiple of {step}
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {formatPrice(linePrice(line))}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {formatPrice(lineTotal(line))}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => removeLine(line.lineId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm">
              No products added yet. Search above to add items.
            </div>
          )}

          {/* Min order warning */}
          {selectedCustomer && orderLines.length > 0 && belowMinimum && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Below order minimum
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Subtotal {formatPrice(subtotal)} is below the{" "}
                  {formatPrice(minOrder)} minimum for{" "}
                  {selectedCustomer.isRepeatCustomer ? "repeat" : "new"} customers.
                  You can override this below.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── 3. Shipping Address ──────────────────────────────────────────── */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">3. Addresses</h2>
          <AddressFields
            label="Shipping Address"
            value={shippingAddr}
            onChange={(f, v) => handleAddrChange("shipping", f, v)}
          />
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="rounded"
              />
              Billing address same as shipping
            </label>
          </div>
          {!sameAsShipping && (
            <AddressFields
              label="Billing Address"
              value={billingAddr}
              onChange={(f, v) => handleAddrChange("billing", f, v)}
            />
          )}
        </section>

        {/* ── 4. Order Details ─────────────────────────────────────────────── */}
        <section className="bg-card border rounded-lg p-6 space-y-5">
          <h2 className="text-lg font-bold">4. Order Details</h2>

          {/* Payment terms */}
          <div>
            <p className="text-sm font-medium mb-2">Payment Terms</p>
            <div className="flex gap-4">
              {(["card", "net30"] as const).map((term) => (
                <label key={term} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentTerms"
                    value={term}
                    checked={paymentTerms === term}
                    onChange={() => setPaymentTerms(term)}
                    className="accent-primary"
                  />
                  {term === "card" ? "Credit Card" : "Net 30"}
                </label>
              ))}
            </div>
            {paymentTerms === "net30" && (
              <p className="text-xs text-muted-foreground mt-1">
                Order will be confirmed with payment due within 30 days.
              </p>
            )}
          </div>

          {/* Customer notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Notes{" "}
              <span className="text-muted-foreground font-normal">(visible to customer)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes to include on the order confirmation email..."
              rows={3}
              className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Admin notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Admin Notes{" "}
              <span className="text-muted-foreground font-normal">(internal only)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes about this order..."
              rows={2}
              className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Min order override */}
          {selectedCustomer && belowMinimum && (
            <div className="p-4 border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideMinimum}
                  onChange={(e) => setOverrideMinimum(e.target.checked)}
                  className="rounded"
                />
                Override order minimum ({formatPrice(minOrder)} required)
              </label>
              {overrideMinimum && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason for override *
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Trade show sample order, existing account exception..."
                    required={overrideMinimum}
                    className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── 5. Summary + Submit ──────────────────────────────────────────── */}
        <section className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-bold">5. Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal ({orderLines.reduce((s, l) => s + l.quantity, 0)} units)
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatPrice(SHIPPING_FEE_CENTS)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {selectedCustomer && (
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Customer: {selectedCustomer.displayName || selectedCustomer.email}</p>
              <p>
                Payment:{" "}
                {paymentTerms === "net30" ? "Net 30" : "Credit Card"}
              </p>
              <p className="text-amber-600 font-medium">
                ⚠ Order will be flagged as admin-created in Firestore.
              </p>
              <p>
                A confirmation email will be sent to {selectedCustomer.email}.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={
              submitting ||
              !selectedCustomer ||
              orderLines.length === 0 ||
              qtyErrors.length > 0
            }
          >
            {submitting ? "Creating Order..." : "Create Order"}
          </Button>
        </section>
      </form>
    </div>
  );
}

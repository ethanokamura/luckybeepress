"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/lib/cart-context";
import { mockProducts, formatCurrency } from "@/lib/mock-data";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { FiPackage, FiTruck, FiShoppingCart, FiCheck } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = mockProducts.find((p) => p.id === params?.id);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-neutral mb-4">
              Product Not Found
            </h2>
            <p className="text-neutral-content mb-6">
              The product you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const isLowStock =
    product.stock_quantity && product.low_stock_threshold
      ? product.stock_quantity <= product.low_stock_threshold
      : false;

  const minOrderQty = product.minimum_order_quantity || 1;
  const margin = product.suggested_retail_price
    ? (
        ((product.suggested_retail_price - product.wholesale_price) /
          product.suggested_retail_price) *
        100
      ).toFixed(0)
    : null;

  const handleAddToCart = () => {
    if (!user) {
      router.push("/api/auth/login");
      return;
    }

    addItem(product, quantity);
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= minOrderQty) {
      setQuantity(num);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-neutral-content">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          {product.category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/products?category=${product.category}`}
                  className="hover:text-primary"
                >
                  {product.category}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-base-content">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <Card padding="none">
            <div className="relative aspect-square bg-base-200 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url ?? ""}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage className="w-32 h-32 text-neutral-content" />
                </div>
              )}

              {isLowStock && (
                <div className="absolute top-4 right-4">
                  <Badge variant="warning">Low Stock</Badge>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            {product.category && (
              <Badge variant="neutral" className="mb-3">
                {product.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-neutral font-serif mb-2">
              {product.name}
            </h1>
          </div>
          {/* Pricing */}
          {user ? (
            <Card className="mb-6 bg-base-100">
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-content mb-1">
                      Wholesale Price
                    </p>
                    <p className="text-3xl font-bold text-neutral">
                      {formatCurrency(product.wholesale_price)}
                    </p>
                    <p className="text-xs text-neutral-content mt-1">
                      per unit
                    </p>
                  </div>

                  {product.suggested_retail_price && (
                    <div>
                      <p className="text-sm text-neutral-content mb-1">
                        Suggested Retail
                      </p>
                      <p className="text-2xl font-semibold text-neutral">
                        {formatCurrency(product.suggested_retail_price)}
                      </p>
                      {margin && (
                        <Badge variant="success" size="sm" className="mt-2">
                          {margin}% margin
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 bg-info/10 border-info/30">
              <CardContent>
                <p className="text-info font-medium mb-3">
                  Sign in to view wholesale pricing
                </p>
                <a href="/api/auth/login">
                  <Button variant="primary" fullWidth>
                    Sign In / Create Account
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral mb-2">
                Description
              </h3>
              <p className="text-base-content leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <Card className="mb-6">
            <CardContent>
              <h3 className="text-lg font-semibold text-neutral mb-3">
                Product Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-base-300">
                  <dt className="text-neutral-content">
                    Minimum Order Quantity
                  </dt>
                  <dd className="font-medium text-neutral">
                    {minOrderQty} units
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-base-300">
                  <dt className="text-neutral-content">Stock Available</dt>
                  <dd className="font-medium text-neutral">
                    {product.stock_quantity || 0} units
                  </dd>
                </div>
                {product.weight_oz && (
                  <div className="flex justify-between py-2 border-b border-base-300">
                    <dt className="text-neutral-content">Weight</dt>
                    <dd className="font-medium text-neutral">
                      {product.weight_oz} oz
                    </dd>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-content">Status</dt>
                  <dd>
                    <Badge
                      variant={product.is_active ? "success" : "error"}
                      size="sm"
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          {user && product.is_active && (
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Quantity (min: {minOrderQty})
                    </label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        min={minOrderQty}
                        className="w-24 text-center"
                      />

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          setQuantity(Math.max(minOrderQty, quantity - 1))
                        }
                      >
                        -
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-base-300">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-neutral-content">Subtotal:</span>
                      <span className="text-2xl font-bold text-neutral">
                        {formatCurrency(product.wholesale_price * quantity)}
                      </span>
                    </div>

                    <Button
                      variant={addedToCart ? "outline" : "primary"}
                      fullWidth
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={addedToCart}
                    >
                      {addedToCart ? (
                        <>
                          <FiCheck className="mr-2" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Info */}
          <div className="mt-6 flex items-start space-x-3 text-sm text-neutral-content">
            <FiTruck className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-base-content">
                Free shipping on orders over $500
              </p>
              <p>Standard delivery: 5-7 business days</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

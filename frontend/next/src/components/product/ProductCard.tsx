import Link from "next/link";
import { Products } from "@/types/products";
import { formatCurrency } from "@/lib/mock-data";
import { Badge, Card, CardContent } from "@/components/ui";
import { FiPackage } from "react-icons/fi";
import Image from "next/image";

interface ProductCardProps {
  product: Products;
  showPricing?: boolean;
}

export function ProductCard({ product, showPricing = true }: ProductCardProps) {
  const isLowStock =
    product.stock_quantity && product.low_stock_threshold
      ? product.stock_quantity <= product.low_stock_threshold
      : false;

  return (
    <Link href={`/products/${product.id}`}>
      <Card hover padding="none" className="h-full">
        {/* Product Image */}
        <div className="relative aspect-4/3 bg-base-200 rounded-t-lg overflow-hidden">
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
              <FiPackage className="w-16 h-16 text-neutral-content" />
            </div>
          )}

          {/* Stock Badge */}
          {isLowStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="neutral" size="sm">
                {product.category}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-lg text-neutral mb-1">
            {product.name}
          </h3>

          {/* SKU */}
          <p className="text-xs text-neutral-content mb-2">
            SKU: {product.sku}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-base-content line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline justify-between">
            {showPricing ? (
              <>
                <div>
                  <span className="text-2xl font-bold text-neutral">
                    {formatCurrency(product.wholesale_price)}
                  </span>
                  <span className="text-sm text-neutral-content ml-1">WSP</span>
                </div>
                {product.suggested_retail_price && (
                  <div className="text-right">
                    <span className="text-sm text-neutral-content">
                      SRP: {formatCurrency(product.suggested_retail_price)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-info font-medium">
                Sign in to view wholesale pricing
              </div>
            )}
          </div>

          {/* MOQ */}
          {product.minimum_order_quantity && (
            <div className="mt-3 pt-3 border-t border-base-300">
              <p className="text-xs text-neutral-content">
                Minimum Order: {product.minimum_order_quantity} units
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

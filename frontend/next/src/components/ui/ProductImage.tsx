"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  aspectRatio?: "square" | "4:3" | "3:4" | "16:9";
  showPlaceholder?: boolean;
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  className = "",
  containerClassName = "",
  aspectRatio = "square",
  showPlaceholder = true,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioStyles = {
    square: "aspect-square",
    "4:3": "aspect-[4/3]",
    "3:4": "aspect-[3/4]",
    "16:9": "aspect-video",
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Show placeholder if no src or error occurred
  if (!src || hasError) {
    if (!showPlaceholder) return null;

    return (
      <div
        className={`relative bg-base-200 flex items-center justify-center ${aspectRatioStyles[aspectRatio]} ${containerClassName}`}
      >
        <div className="flex flex-col items-center gap-2 text-base-content/40">
          <ImageOff className="h-8 w-8" />
          <span className="text-xs">No image</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div
        className={`relative overflow-hidden ${aspectRatioStyles[aspectRatio]} ${containerClassName}`}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-base-200 animate-pulse" />
        )}

        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className}`}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-base-200 animate-pulse"
          style={{ width, height }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
      />
    </div>
  );
}

// Thumbnail variant for cart/lists
interface ProductThumbnailProps {
  src: string | null | undefined;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductThumbnail({
  src,
  alt,
  size = "md",
  className = "",
}: ProductThumbnailProps) {
  const sizeStyles = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  return (
    <div className={`${sizeStyles[size]} shrink-0 ${className}`}>
      <ProductImage
        src={src}
        alt={alt}
        fill
        containerClassName="rounded-lg h-full w-full"
        className="rounded-lg"
        aspectRatio="square"
      />
    </div>
  );
}

// Gallery view with multiple images
interface ProductGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductGallery({
  images,
  alt,
  className = "",
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <ProductImage
        src={null}
        alt={alt}
        fill
        containerClassName={`rounded-xl ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image */}
      <ProductImage
        src={images[selectedIndex]}
        alt={`${alt} - Image ${selectedIndex + 1}`}
        fill
        containerClassName="rounded-xl"
        priority
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`shrink-0 rounded-lg overflow-hidden transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

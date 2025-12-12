/**
 * Formatting utilities for currency, dates, and numbers
 * Used throughout the application for consistent display formatting
 */

// ============================================================================
// Currency Formatting
// ============================================================================

/**
 * Formats a number as USD currency
 * @param amount - The amount to format
 * @param showCents - Whether to always show cents (default: true)
 * @returns Formatted currency string (e.g., "$18.00" or "$18")
 */
export function formatCurrency(
  amount: number,
  showCents: boolean = true
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Formats a price range (e.g., "$18 - $44")
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return formatCurrency(min);
  }
  return `${formatCurrency(min, false)} - ${formatCurrency(max, false)}`;
}

/**
 * Calculates and formats the profit margin percentage
 * @param wholesalePrice - The wholesale price (WSP)
 * @param retailPrice - The suggested retail price (SRP)
 * @returns Formatted percentage string (e.g., "50%")
 */
export function formatMargin(
  wholesalePrice: number,
  retailPrice: number
): string {
  if (retailPrice <= 0) return "0%";
  const margin = ((retailPrice - wholesalePrice) / retailPrice) * 100;
  return `${Math.round(margin)}%`;
}

/**
 * Calculates the markup multiplier (SRP / WSP)
 * @returns Formatted multiplier string (e.g., "2x")
 */
export function formatMarkup(
  wholesalePrice: number,
  retailPrice: number
): string {
  if (wholesalePrice <= 0) return "0x";
  const markup = retailPrice / wholesalePrice;
  return `${markup.toFixed(1)}x`;
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Formats a date in a human-readable format
 * @param date - Date object, string, or null
 * @param style - "short" (Jan 15), "medium" (Jan 15, 2024), "long" (January 15, 2024)
 */
export function formatDate(
  date: Date | string | null | undefined,
  style: "short" | "medium" | "long" = "medium"
): string {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "—";

  const options: Intl.DateTimeFormatOptions = {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    ...(style !== "short" && { year: "numeric" }),
  };

  return d.toLocaleDateString("en-US", options);
}

/**
 * Formats a date with time
 * @param date - Date object, string, or null
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "—";

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, "day");
  } else if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, "hour");
  } else {
    return rtf.format(diffMinutes, "minute");
  }
}

/**
 * Formats a date for payment due display (e.g., "Due Jan 15" or "Overdue by 3 days")
 */
export function formatDueDate(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "—";

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${
      Math.abs(diffDays) !== 1 ? "s" : ""
    }`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return `Due ${formatDate(d, "short")}`;
  }
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Formats a number with thousands separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Formats a number as a compact representation (e.g., 1.2k, 3.4M)
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a percentage value
 * @param value - The value (0.5 = 50%, or 50 = 50% based on isDecimal)
 * @param isDecimal - Whether the input is already a decimal (default: false)
 */
export function formatPercentage(
  value: number,
  isDecimal: boolean = false
): string {
  const pct = isDecimal ? value * 100 : value;
  return `${Math.round(pct)}%`;
}

/**
 * Formats weight in ounces with unit
 */
export function formatWeight(weightOz: number | null | undefined): string {
  if (weightOz == null) return "—";

  if (weightOz >= 16) {
    const lbs = weightOz / 16;
    return `${lbs.toFixed(1)} lb`;
  }
  return `${weightOz.toFixed(1)} oz`;
}

/**
 * Formats a quantity with the appropriate unit label
 * @param quantity - The quantity
 * @param unit - "cards" or "boxes"
 */
export function formatQuantity(
  quantity: number,
  unit: "cards" | "boxes" = "cards"
): string {
  const singular = unit === "cards" ? "card" : "box";
  const plural = unit === "cards" ? "cards" : "boxes";
  return `${quantity} ${quantity === 1 ? singular : plural}`;
}

// ============================================================================
// Order/Status Formatting
// ============================================================================

/**
 * Formats an order number for display (ensures consistent format)
 */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.toUpperCase();
}

/**
 * Formats a tracking number with carrier link if available
 */
export function getTrackingUrl(
  trackingNumber: string,
  carrier: string | null
): string | null {
  if (!trackingNumber) return null;

  const carrierLower = carrier?.toLowerCase() || "";

  if (carrierLower.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrierLower.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrierLower.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
  }

  return null;
}

// ============================================================================
// Address Formatting
// ============================================================================

/**
 * Formats an address into a single line
 */
export function formatAddressLine(address: {
  street_address_1: string;
  street_address_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string | null;
}): string {
  const parts = [
    address.street_address_1,
    address.street_address_2,
    `${address.city}, ${address.state} ${address.postal_code}`,
  ].filter(Boolean);

  if (
    address.country &&
    address.country !== "USA" &&
    address.country !== "US"
  ) {
    parts.push(address.country);
  }

  return parts.join(", ");
}

/**
 * Formats an address into multiple lines (for display in cards/labels)
 */
export function formatAddressMultiline(address: {
  company_name?: string | null;
  street_address_1: string;
  street_address_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string | null;
}): string[] {
  const lines: string[] = [];

  if (address.company_name) {
    lines.push(address.company_name);
  }
  lines.push(address.street_address_1);
  if (address.street_address_2) {
    lines.push(address.street_address_2);
  }
  lines.push(`${address.city}, ${address.state} ${address.postal_code}`);
  if (
    address.country &&
    address.country !== "USA" &&
    address.country !== "US"
  ) {
    lines.push(address.country);
  }

  return lines;
}

// ============================================================================
// Phone Formatting
// ============================================================================

/**
 * Formats a phone number for display
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
      7
    )}`;
  }

  // Return original if not a standard format
  return phone;
}

"use client";

import { useState, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "./Button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  loading = false,
  size = "md",
  showLabel = false,
  label = "Qty",
  className = "",
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  }, [value, min, step, onChange]);

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  }, [value, max, step, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    const parsed = parseInt(rawValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      // Round to nearest step
      const rounded = Math.round(clamped / step) * step;
      onChange(rounded);
    }
  };

  const handleBlur = () => {
    // Ensure displayed value matches actual value on blur
    setInputValue(value.toString());
  };

  const sizeStyles = {
    sm: {
      button: "h-7 w-7",
      input: "h-7 w-12 text-sm",
      icon: "h-3 w-3",
    },
    md: {
      button: "h-9 w-9",
      input: "h-9 w-14 text-base",
      icon: "h-4 w-4",
    },
    lg: {
      button: "h-11 w-11",
      input: "h-11 w-16 text-lg",
      icon: "h-5 w-5",
    },
  };

  const styles = sizeStyles[size];
  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showLabel && (
        <span className="text-sm text-base-content/70 mr-2">{label}</span>
      )}
      <div className="flex items-center rounded-lg border border-base-300 bg-base-100">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || loading || isMin}
          className={`${styles.button} flex items-center justify-center rounded-l-lg transition-colors
            hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-inset`}
          aria-label="Decrease quantity"
        >
          <Minus className={styles.icon} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled || loading}
          className={`${styles.input} text-center border-x border-base-300 bg-transparent
            focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Quantity"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || loading || isMax}
          className={`${styles.button} flex items-center justify-center rounded-r-lg transition-colors
            hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-inset`}
          aria-label="Increase quantity"
        >
          <Plus className={styles.icon} />
        </button>
      </div>

      {loading && (
        <div className="ml-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

// Compact inline variant for cart items
interface InlineQuantitySelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  loading?: boolean;
  min?: number;
}

export function InlineQuantitySelector({
  value,
  onIncrement,
  onDecrement,
  onRemove,
  disabled = false,
  loading = false,
  min = 0,
}: InlineQuantitySelectorProps) {
  const isMin = value <= min;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-full border border-base-300 bg-base-100">
        <button
          type="button"
          onClick={isMin && onRemove ? onRemove : onDecrement}
          disabled={disabled || loading}
          className="h-8 w-8 flex items-center justify-center rounded-l-full transition-colors
            hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isMin && onRemove ? "Remove item" : "Decrease quantity"}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="w-10 text-center text-sm font-medium tabular-nums">
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            value
          )}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          disabled={disabled || loading}
          className="h-8 w-8 flex items-center justify-center rounded-r-full transition-colors
            hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


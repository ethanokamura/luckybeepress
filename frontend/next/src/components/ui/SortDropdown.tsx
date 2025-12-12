"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, ArrowUpDown } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: readonly SortOption[] | SortOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  onChange,
  label = "Sort by",
  placeholder = "Select...",
  className = "",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-base-300 bg-base-100 
          hover:border-primary/50 transition-colors text-sm min-w-[180px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="h-4 w-4 text-base-content/60" />
        <span className="flex-1 text-left">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-base-content/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg border border-base-300 
            bg-base-100 shadow-lg z-50 max-h-64 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors
                ${
                  option.value === value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200"
                }`}
              role="option"
              aria-selected={option.value === value}
            >
              <span className="flex-1">{option.label}</span>
              {option.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline sort toggle (for mobile/compact views)
interface SortToggleProps {
  options: readonly SortOption[] | SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortToggle({
  options,
  value,
  onChange,
  className = "",
}: SortToggleProps) {
  const currentIndex = options.findIndex((opt) => opt.value === value);

  const handleToggle = () => {
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  };

  const selectedOption = options[currentIndex] || options[0];

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm 
        bg-base-200 hover:bg-base-300 transition-colors ${className}`}
    >
      <ArrowUpDown className="h-4 w-4" />
      <span>{selectedOption?.label}</span>
    </button>
  );
}

// View mode toggle (grid/list)
interface ViewModeToggleProps {
  mode: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
  className?: string;
}

export function ViewModeToggle({
  mode,
  onChange,
  className = "",
}: ViewModeToggleProps) {
  return (
    <div
      className={`flex items-center rounded-lg border border-base-300 p-1 ${className}`}
    >
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded transition-colors ${
          mode === "grid" ? "bg-primary text-primary-content" : "hover:bg-base-200"
        }`}
        aria-label="Grid view"
        aria-pressed={mode === "grid"}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded transition-colors ${
          mode === "list" ? "bg-primary text-primary-content" : "hover:bg-base-200"
        }`}
        aria-label="List view"
        aria-pressed={mode === "list"}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}


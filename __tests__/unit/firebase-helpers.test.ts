import { vi, describe, it, expect } from "vitest";

// Mock firebase/firestore — collection() must return something with withConverter()
vi.mock("firebase/firestore", () => {
  const withConverter = vi.fn().mockReturnThis();
  const chainable = { withConverter };
  return {
    collection: vi.fn(() => chainable),
    doc: vi.fn(() => chainable),
    serverTimestamp: vi.fn(() => null),
    Timestamp: { fromDate: vi.fn() },
    getFirestore: vi.fn(),
  };
});
vi.mock("@/lib/firebase", () => ({ db: {} }));

// Import pure functions after mocks
import {
  toCents,
  toDollars,
  formatPrice,
  generateSlug,
  generateOrderNumber,
  calculateSingleTotal,
  calculateBoxTotal,
  formatWholesaleInfo,
} from "@/lib/firebase-helpers";

// ============================================================
// toCents
// ============================================================

describe("toCents", () => {
  it("converts standard product price", () => {
    expect(toCents(3.0)).toBe(300);
  });

  it("converts standard box price", () => {
    expect(toCents(11.0)).toBe(1100);
  });

  it("handles zero", () => {
    expect(toCents(0)).toBe(0);
  });

  it("handles minimum cent (0.01)", () => {
    expect(toCents(0.01)).toBe(1);
  });

  it("floating-point: 1.005 * 100 evaluates to 100.4999... so result is 100", () => {
    // JS floating-point: 1.005 cannot be represented exactly; Math.round(1.005*100) = 100
    expect(toCents(1.005)).toBe(100);
  });

  it("handles larger amount (150.99)", () => {
    expect(toCents(150.99)).toBe(15099);
  });
});

// ============================================================
// toDollars
// ============================================================

describe("toDollars", () => {
  it("converts 300 cents to 3", () => {
    expect(toDollars(300)).toBe(3);
  });

  it("converts 1100 cents to 11", () => {
    expect(toDollars(1100)).toBe(11);
  });

  it("handles zero", () => {
    expect(toDollars(0)).toBe(0);
  });

  it("converts 1 cent to 0.01", () => {
    expect(toDollars(1)).toBe(0.01);
  });

  it("converts 15000 cents to 150", () => {
    expect(toDollars(15000)).toBe(150);
  });
});

// ============================================================
// formatPrice
// ============================================================

describe("formatPrice", () => {
  it("formats 300 cents as $3.00", () => {
    expect(formatPrice(300)).toBe("$3.00");
  });

  it("formats 0 cents as $0.00", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("formats 1099 cents as $10.99", () => {
    expect(formatPrice(1099)).toBe("$10.99");
  });

  it("formats 15000 cents as $150.00", () => {
    expect(formatPrice(15000)).toBe("$150.00");
  });

  it("formats 100 cents as $1.00", () => {
    expect(formatPrice(100)).toBe("$1.00");
  });
});

// ============================================================
// generateSlug
// ============================================================

describe("generateSlug", () => {
  it("basic case: lowercases and hyphenates words", () => {
    expect(generateSlug("Birthday Bee Card")).toBe("birthday-bee-card");
  });

  it("strips apostrophes and punctuation", () => {
    expect(generateSlug("Lucky Bee's Greeting!")).toBe("lucky-bees-greeting");
  });

  it("trims leading and trailing spaces", () => {
    expect(generateSlug("  Leading Spaces  ")).toBe("leading-spaces");
  });

  it("collapses multiple spaces into one dash", () => {
    expect(generateSlug("Multiple   Spaces")).toBe("multiple-spaces");
  });

  it("collapses consecutive dashes", () => {
    expect(generateSlug("A--Double--Dash")).toBe("a-double-dash");
  });

  it("lowercases ALL CAPS", () => {
    expect(generateSlug("ALL CAPS")).toBe("all-caps");
  });
});

// ============================================================
// generateOrderNumber
// ============================================================

describe("generateOrderNumber", () => {
  it("matches the ORD-YYYY-XXXXXX format", () => {
    const result = generateOrderNumber();
    expect(result).toMatch(/^ORD-\d{4}-[A-Z0-9]{6}$/);
  });

  it("year portion equals the current year", () => {
    const result = generateOrderNumber();
    const year = result.split("-")[1];
    expect(year).toBe(String(new Date().getFullYear()));
  });

  it("two calls return different values (probabilistic)", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    // Probability of collision: 1 in 36^6 ≈ 2 billion — effectively zero
    expect(a).not.toBe(b);
  });
});

// ============================================================
// calculateSingleTotal
// ============================================================

describe("calculateSingleTotal", () => {
  it("(300, 6) = 1800", () => {
    expect(calculateSingleTotal(300, 6)).toBe(1800);
  });

  it("(300, 1) = 300", () => {
    expect(calculateSingleTotal(300, 1)).toBe(300);
  });

  it("(0, 100) = 0", () => {
    expect(calculateSingleTotal(0, 100)).toBe(0);
  });

  it("(500, 10) = 5000", () => {
    expect(calculateSingleTotal(500, 10)).toBe(5000);
  });
});

// ============================================================
// calculateBoxTotal
// ============================================================

describe("calculateBoxTotal", () => {
  it("(1100, 4) = 4400", () => {
    expect(calculateBoxTotal(1100, 4)).toBe(4400);
  });

  it("(1100, 1) = 1100", () => {
    expect(calculateBoxTotal(1100, 1)).toBe(1100);
  });

  it("(0, 4) = 0", () => {
    expect(calculateBoxTotal(0, 4)).toBe(0);
  });
});

// ============================================================
// formatWholesaleInfo
// ============================================================

describe("formatWholesaleInfo", () => {
  it("no box option: shows card price only", () => {
    expect(formatWholesaleInfo(300, false, null)).toBe("$3.00/card");
  });

  it("with box option and price: shows both prices", () => {
    expect(formatWholesaleInfo(300, true, 1100)).toBe("$3.00/card or $11.00/box");
  });

  it("box option true but null price: shows card price only", () => {
    expect(formatWholesaleInfo(300, true, null)).toBe("$3.00/card");
  });
});

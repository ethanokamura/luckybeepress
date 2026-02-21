# Contract: Utility Functions (`lib/firebase-helpers.ts`)

**Scope**: All exported pure functions with no external dependencies.

---

## `toCents(dollars: number): number`

Converts a dollar amount to integer cents.

| Input | Expected Output | Notes |
|-------|----------------|-------|
| `3.00` | `300` | Standard product price |
| `11.00` | `1100` | Standard box price |
| `0` | `0` | Zero edge case |
| `0.01` | `1` | Minimum cent |
| `1.005` | `101` | Rounds half-up |
| `150.99` | `15099` | Checkout minimum territory |

---

## `toDollars(cents: number): number`

Converts integer cents back to a decimal dollar amount.

| Input | Expected Output |
|-------|----------------|
| `300` | `3` |
| `1100` | `11` |
| `0` | `0` |
| `1` | `0.01` |
| `15000` | `150` |

---

## `formatPrice(cents: number, currency?: string): string`

Formats cents as a localized currency string.

| Input | Expected Output |
|-------|----------------|
| `300` | `"$3.00"` |
| `1099` | `"$10.99"` |
| `0` | `"$0.00"` |
| `15000` | `"$150.00"` |
| `100` | `"$1.00"` |

---

## `generateSlug(name: string): string`

Converts a product name to a URL-safe slug.

| Input | Expected Output | Notes |
|-------|----------------|-------|
| `"Birthday Bee Card"` | `"birthday-bee-card"` | Basic case |
| `"Lucky Bee's Greeting!"` | `"lucky-bees-greeting"` | Apostrophe + punct stripped |
| `"  Leading Spaces  "` | `"leading-spaces"` | Trim |
| `"Multiple   Spaces"` | `"multiple-spaces"` | Collapse spaces |
| `"A--Double--Dash"` | `"a-double-dash"` | Collapse dashes |
| `"ALL CAPS"` | `"all-caps"` | Lowercase |

---

## `generateOrderNumber(): string`

Generates a human-readable order number in format `ORD-YYYY-XXXXXX`.

| Assertion | Expected |
|-----------|----------|
| Matches `/^ORD-\d{4}-[A-Z0-9]{6}$/` | `true` |
| Year portion equals current year | `true` |
| Two calls return different values (probabilistic) | `true` with overwhelming probability |

---

## `calculateSingleTotal(priceInCents: number, quantity: number): number`

| Input | Expected Output |
|-------|----------------|
| `(300, 6)` | `1800` |
| `(300, 1)` | `300` |
| `(0, 100)` | `0` |
| `(500, 10)` | `5000` |

---

## `calculateBoxTotal(boxPriceInCents: number, boxQuantity: number): number`

| Input | Expected Output |
|-------|----------------|
| `(1100, 4)` | `4400` |
| `(1100, 1)` | `1100` |
| `(0, 4)` | `0` |

---

## `formatWholesaleInfo(wholesalePrice, hasBoxOption, boxPrice): string`

| Input | Expected Output |
|-------|----------------|
| `(300, false, null)` | `"$3.00/card"` |
| `(300, true, 1100)` | `"$3.00/card or $11.00/box"` |
| `(300, true, null)` | `"$3.00/card"` (no box price → no box segment) |

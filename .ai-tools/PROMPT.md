You are the Senior Full-Stack Architect AI. Your task is to generate a phased implementation plan for the Next.js frontend.

***CRITICAL ARCHITECTURAL SCOPE CONSTRAINT:***
The foundational data contracts (TypeScript Types) and server communication logic (Next.js Server Actions and Zod Validators) HAVE ALREADY BEEN IMPLEMENTED.

***YOUR PLAN MUST FOCUS ONLY ON THE USER INTERFACE (UI) LAYER.***

--- PRODUCT REQUIREMENTS DOCUMENT (PRD) ---

# Project Overview & Context

## About
LuckyBeePress Wholesale - A B2B e-commerce platform for Lucky Bee Press, an established letterpress stationary business selling artisan greeting cards to retail stores and boutiques. This is a custom wholesale ordering system to replace their current Faire.com dependency, giving them full control over their wholesale operations, customer relationships, and pricing strategies.

### Brand Credibility
- **17+ years in business** on Etsy (established 2008)
- **5-star overall rating** with 2,000+ reviews
- **10,000+ sales** demonstrating proven demand and quality
- Hand-mixed inks and 100% cotton cardstock - premium artisan quality
- Eco-conscious: Uses recycled envelopes

### Product Specifications
**Single Cards:**
- Sold in increments of 6 cards
- $3 per card ($18 per set/increment)
- All card categories available as singles
- Standard A2 size (5.5"W × 4.25"H)
- Letterpress printed on 100% cotton cardstock
- Comes with recycled envelope
- Hand-mixed inks for unique color quality

**Box Sets:**
- Sold in increments of 4 boxes (each box contains 6 cards)
- $11 per box ($44 per set/increment)
- **Only available for**: Holiday cards and Thank You cards
- Same quality specs as singles (cotton cardstock, recycled envelopes)
- Retail-ready packaging for gift shop displays

## Goal/Objective

### Primary Goals
- **Replace Faire dependency**: Create a custom wholesale platform that eliminates third-party marketplace fees (15-25% commission) and gives Lucky Bee Press direct control over their wholesale channel
- **Streamline wholesale ordering**: Enable retail buyers to browse products, manage orders, and reorder efficiently without marketplace friction
- **Reduce operational costs**: Eliminate monthly Faire fees while maintaining or improving the ordering experience
- **Build direct customer relationships**: Own customer data and communication channels to foster stronger retailer partnerships
- **Leverage brand credibility**: Showcase 17 years of excellence and 5-star reputation to convert wholesale buyers

### Success Metrics
- Smooth migration of existing wholesale customers from Faire
- Reduced order processing time for both admin and customers
- Lower operational costs (no marketplace fees = 15-25% margin improvement)
- Increased repeat order rate through better UX
- Ability to offer custom pricing/terms per customer
- Meeting $150 minimum order requirement compliance
- Accurate shipping estimates based on weight/quantity

### Business Requirements

**Payment Terms:**
- **Credit Card**: Upfront payment via Stripe/similar (immediate processing)
- **Net 30**: Invoice-based payment for established customers (30-day terms)
- Payment method eligibility determined by customer account status
- Clear indication of available payment methods during checkout

**Order Requirements:**
- **Minimum purchase**: $150 per order (enforced at checkout)
- Quantity increments enforced:
  - Singles: Multiples of 6 cards
  - Boxes: Multiples of 4 boxes
- Clear messaging when minimum not met
- NO RETURNS

**Shipping:**
- Weight-based shipping estimation (cards have consistent weight)
- Calculation: quantity × weight per unit
- Display estimated shipping cost before checkout completion
- Integration with USPS/UPS for rate calculation
- Flat-rate options for simplicity (optional)

### Key Features

**Homepage:**
- Professional landing page showcasing brand story and credibility
- **Best Sellers section**: Top-performing cards to drive quick orders
- **New Arrivals section**: Recently added designs to encourage exploration
- **Contact Information**: Clear business contact, support email, phone
- Trust indicators: "17 years on Etsy", "5-star rated", "10k+ sales"
- Clear CTAs: "Browse Catalog", "Create Wholesale Account"

**For Wholesale Customers (Retailers):**
- Browse catalog with wholesale pricing (WSP) and suggested retail pricing (SRP)
- Filter by: Category, Product Type (singles vs boxes), New arrivals, Best sellers
- Product detail pages showing:
  - High-quality product images
  - Increment requirements (6 cards or 4 boxes)
  - Material specs (100% cotton, hand-mixed inks, recycled envelope)
  - Size specifications (A2 - 5.5" × 4.25")
  - Stock availability
- Easy reordering of previous purchases ("Reorder" button on order history)
- Multiple shipping addresses management
- Order tracking and history
- Net 30 payment terms for qualified accounts
- Minimum order quantity enforcement ($150 minimum)
- Shopping cart with running total and minimum order indicator
- Estimated shipping calculator in cart
  
**For Admin (Lucky Bee Press):**
- Order management and fulfillment workflow
- Customer account management with custom pricing/terms
- Approve/manage Net 30 payment term eligibility
- Inventory tracking for singles and box sets separately
- Product catalog management:
  - Add/edit products
  - Toggle box set availability (Holiday/Thank You only)
  - Update best seller status
  - Mark as "New Arrival"
- Sales reporting and analytics:
  - Best sellers tracking
  - Category performance
  - Customer lifetime value
  - Seasonal trends
- Invoice generation (especially for Net 30 orders)
- Shipping label generation

## Target Users

### Primary User: Wholesale Customers (B2B Retailers)
**Who they are:**
- Independent boutique owners
- Gift shop managers
- Bookstore buyers
- Specialty retail store owners
- Museum shop buyers
- Stationery store owners

**Their needs:**
- Quick browsing and reordering of proven sellers
- Clear wholesale vs. retail pricing (need 2x markup minimum for profit)
- Reliable inventory availability info
- Easy order tracking
- Professional invoicing for their accounting records
- Flexible payment terms (Net 30 for established relationships)
- Understanding increment requirements (6 singles or 4 boxes)
- Confidence in quality (17 years, 5-star reputation helps here)

**Their pain points with current Faire:**
- Marketplace fees passed to retailers through higher prices
- Limited customization and direct communication with Lucky Bee Press
- Generic platform not tailored to letterpress/stationery needs
- Difficulty getting custom orders or pricing negotiations
- Less favorable terms for loyal, repeat customers

**User behavior:**
- Order seasonally (Valentine's Day, Mother's Day, Christmas, Thank You cards)
- Reorder bestsellers regularly (75% reorders, 25% new exploration)
- Browse for new designs quarterly
- Compare WSP to SRP to calculate margins (need 50%+ margin)
- Calculate order to hit $150 minimum efficiently
- Prefer box sets for high-traffic items (easier to display and sell)
- Stock holiday cards in box sets 2-3 months before season

**Typical order patterns:**
- Small boutique: $150-300 per order (mixing bestsellers + seasonal)
- Medium gift shop: $300-600 per order (box sets + singles)
- Large retailer: $600-1200+ per order (bulk boxes for holidays)

### Secondary User: Admin (Lucky Bee Press Business Owner)
**Who they are:**
- Small business owner/operator (possibly 1-3 person team)
- Manages wholesale operations, production, and fulfillment
- Likely managing 50-200 wholesale accounts
- Has deep expertise in letterpress but needs simple admin tools

**Their needs:**
- Efficient order processing workflow
- Visibility into inventory levels for singles vs. box sets
- Customer account management with custom terms
- Ability to grant Net 30 payment terms to trusted customers
- Sales analytics to inform production decisions:
  - Which designs to reprint
  - Which categories to expand
  - Seasonal forecasting
- Bulk invoice generation for Net 30 accounts
- Product catalog updates without developer help
- Best seller tracking for marketing decisions
- New arrival management for homepage features

**Their pain points with Faire:**
- High marketplace fees (15-25% commission eating into margins)
- Limited control over customer experience and branding
- Can't offer custom pricing per customer or volume discounts
- Poor analytics and reporting (can't see customer lifetime value)
- Dependency on third-party platform for business-critical operations
- Faire takes cut even on repeat customers they brought themselves

**User behavior:**
- Processes orders in batches (daily or every other day)
- Updates inventory after production runs (monthly for popular items)
- Reviews analytics monthly for production planning
- Communicates directly with key accounts via email/phone
- Manages seasonal promotions (Valentine's, Holiday season)
- Produces cards in batches based on historical sales data
- Grants Net 30 terms to customers after 2-3 successful orders

## User Journey Examples

### Wholesale Customer Journey (First Order):
1. Discovers Lucky Bee Press through Instagram, trade show, or referral
2. Visits homepage, sees 17 years of credibility and best sellers
3. Creates wholesale account with business details (EIN, resale certificate)
4. Browses catalog - filters by "Birthday" category
5. Views product detail for "Happy Birthday Cowboy" card
   - Sees $3/card, sold in increments of 6 ($18)
   - Reads material specs (cotton cardstock, hand-mixed inks)
   - Adds 2 sets (12 cards = $36) to cart
6. Continues browsing, adds Holiday box set (4 boxes = $44)
7. Cart shows $80 total with warning: "Add $70 more to reach $150 minimum"
8. Adds more items to reach $180 subtotal
9. Views estimated shipping ($15-20 based on weight)
10. Proceeds to checkout
11. Enters shipping address for boutique
12. Selects "Credit Card" payment (Net 30 not yet available)
13. Reviews order total: $180 + shipping
14. Places order
15. Receives order confirmation email with estimated ship date (3-5 business days)
16. Receives tracking number when shipped
17. Receives shipment with packing slip matching Faire format
18. Displays cards in store, they sell well
19. Returns to reorder in 4-6 weeks

### Wholesale Customer Journey (Reorder - Established Customer):
1. Logs into account
2. Goes to "Order History"
3. Finds previous order from 2 months ago
4. Clicks "Reorder" button - cart pre-populates with same items
5. Adjusts quantities: increases Holiday boxes from 4 to 8 (anticipating season)
6. Cart total: $220
7. Proceeds to checkout with saved shipping address
8. Selects "Net 30" payment (now available after 3 successful orders)
9. Reviews and confirms order
10. Receives invoice via email, pays within 30 days
11. Order ships same day (established customer priority)

### Seasonal Bulk Order Journey:
1. Customer logs in mid-October
2. Filters by "Holiday" category
3. Sees "Christmas Cheer" box set is a best seller
4. Orders 20 boxes (5 increments = $220)
5. Adds variety of Holiday singles (24 cards = $72)
6. Adds "Thank You" box set for post-holiday gifts (4 boxes = $44)
7. Total: $336 + shipping
8. Selects Net 30, ships to store
9. Receives order in time for holiday shopping season
10. Cards sell out by December 20th
11. Reorders in January for Valentine's inventory

### Admin Journey (Order Fulfillment):
1. Receives email notification of new order from "Boutique on Main"
2. Opens admin dashboard, sees order #EK2REBD5WK
3. Reviews order details:
   - 6 singles (36 cards across various designs)
   - 1 Holiday box set (4 boxes)
   - Total: $152 + $12 shipping
   - Payment: Credit Card (already processed)
4. Checks inventory:
   - All items in stock
   - Notes that "Heart Love Story" is running low (triggers reprint)
5. Marks order as "confirmed"
6. Prints packing slip (matches Faire format for familiarity)
7. Pulls inventory from organized storage
8. Packs order with tissue paper and branding
9. Generates shipping label via USPS
10. Enters tracking number in system
11. Marks order as "shipped"
12. Customer automatically receives tracking email
13. After 5 days, marks as "delivered" (confirmed by tracking)
14. Follows up with customer via email: "How did the cards sell?"

### Admin Journey (Production Planning):
1. Opens analytics dashboard on 1st of month
2. Reviews best sellers report:
   - "Love You Floral Font" sold 240 cards last month (40 sets)
   - "Happy Birthday Cowboy" sold 180 cards (30 sets)
   - Holiday boxes trending up (season approaching)
3. Checks inventory levels:
   - "Love You Floral Font" down to 30 cards (5 sets) - needs reprint
   - Holiday boxes at 50 boxes - needs production run
4. Plans production schedule:
   - Print 300 more "Love You Floral Font" singles
   - Print 200 Holiday box sets (1200 cards)
5. Updates "New Arrivals" section with 3 recently printed designs
6. Sends email newsletter to wholesale customers about new designs
7. Monitors orders over next week to validate production decisions

## Design Philosophy
- **Professional & Trustworthy**: B2B buyers need confidence in their supplier
  - Showcase 17 years of business and 5-star rating prominently
  - Clean, organized layouts
  - Clear pricing and terms
  - Professional product photography
- **Artisan & Warm**: Reflect the handcrafted nature of letterpress work
  - Warm color palette (yellows, creams, natural tones)
  - Tactile imagery showing paper texture
  - Friendly but professional copy
  - Emphasis on hand-mixed inks and cotton cardstock quality
- **Clean & Efficient**: Wholesale buyers are repeat users who value speed
  - Fast navigation and filtering
  - Quick reorder functionality
  - Minimal clicks to checkout
  - Clear cart status and minimum order indicators
- **Mobile-Friendly**: Buyers browse on all devices, order on desktop
  - Responsive product grids
  - Touch-friendly cart controls
  - Mobile order history access
- **Faire-inspired**: Familiar patterns for customers transitioning from Faire
  - Similar packing slip format
  - Comparable order status flow
  - WSP/SRP display patterns
  - Product grid layouts

--- END PRD ---

--- UI/VISUAL CONTEXT ---

# Frontend UI/UX Requirements
This section covers the design guidelines & aesthetics required for the app.

## General Principles (Applies to both Light & Dark)
- Layout & Spacing: Utilize generous white space (or dark space) with ample padding around content sections and between modular components. Maintain a clear, multi-column grid structure (visible in data-analytics.webp).
- Containers & Cards: Employ rounded corners universally—on cards, buttons, input fields, and main container elements. Components should have subtle depth, often achieved through layered cards or soft shadows (in light mode) or glow effects (in dark mode).
- Typography: Use a modern, highly readable sans-serif typeface (e.g., Inter, Plus Jakarta Sans style). Ensure clear typographic hierarchy with large, bold headlines and crisp body text for data readability.
- Data Visualization: Charts and graphs must be clean, legible, and use color strategically to highlight key metrics. Avoid visual clutter in data displays.

## Light Mode Aesthetic (Reference: data-analytics.webp, buffer.jpg, base44.jpg)
- Color Palette: Use a primary canvas of soft, off-white or light gray. Incorporate pastel, gradient backgrounds (peach/orange, mint green, lavender, sky blue) that blend seamlessly, especially in hero sections or feature blocks (base44.jpg, buffer.jpg).
- Depth & Shadows: Use distinct, soft drop shadows (z-depth) to lift cards and interactive elements off the background, reinforcing a tactile feel.
- Accent Colors: Use playful, approachable accent colors (bright greens, soft oranges, clear purples) for CTAs, indicators, and primary navigation elements.

## Dark Mode Aesthetic (Reference: data-analytics-dark.webp, linear.jpg, home-screens.jpg)
- Color Palette: Use deep, saturated charcoal gray and black backgrounds (#101014 style) for the primary canvas. Avoid pure black to maintain visual depth.
- Contrast & Accents: Achieve high contrast using clean white or light gray text. Accent colors should be neon or luminous (bright cyan, electric green, vivid purple) to appear to glow against the dark backdrop.
- Component Style: Components often feature subtle, thin borders or outlines rather than heavy shadows. Use minimalist lines and subtle internal gradients to define modular data blocks.
- Technical Style: For detailed views (like product listings or code panels), incorporate a subtle grid or fine noise texture on the background to evoke a technical/developer tool feel (linear.jpg).

## Component Styles
- Buttons: Use pill-shaped buttons with solid fill colors for primary CTAs and outline/ghost styles for secondary actions. State changes (hover/active) should be visually immediate.
- Navigation: Minimal and clean. App UIs (data-analytics.webp) use a collapsible, modern left-hand sidebar for main navigation, while landing pages use a clean header with minimal links and prominent CTA buttons.
- Forms/Inputs: Clean, rounded input fields that are visually distinct in both light and dark modes (using soft background fill in light, or light border in dark).

## Accessibility & Best Practices
- Color contrast ratio: Minimum 4.5:1 for body text, 3:1 for large text
- Focus states: 2-3px outline with accent color at 50% opacity, 2px offset
- Interactive elements: Minimum 44x44px touch target
- Loading states: Skeleton screens or spinner animations
- Error states: Red accent with clear messaging
- Alt text for all images and icons
- Semantic labeling for all inputs (buttons, inputs, forms, checkboxes, etc)

## Modern Web Aesthetics:
- Embrace white space; avoid cluttered layouts
- Use real content and screenshots, not placeholder graphics
- Rounded corners everywhere (8px minimum, up to 24px for cards)
- Subtle depth through shadows rather than borders
- Playful but professional tone in visual design
- Mobile-first responsive design with fluid scaling
- Fast, performant animations (use transform and opacity only)

## Reference Mood Summary
- Buffer.com (Landing Page): Clean, friendly, colorful accent blocks, playful illustrations, strong social proof elements, soft pastel background blocks.
- Linear.app / home-screens.jpg (Dark Technical UI): Deep black background, code-style typography, subtle technical grid patterns, high-contrast neon accents (green/purple).
- Base44.com (Landing Page): Soft pastels, dreamy gradients, ultra-generous spacing, rounded everything, modern and approachable.
- Genral Analytics Dashboard (Light App UI): Professional, data-heavy, excellent use of white space, clean sidebar navigation, orange/green accent colors.
- Genral Analytics Dashboard (Dark App UI): High-contrast dashboard, deep blue/purple tones, strategic use of luminous accent colors in charts.

---

## Color System (Design Tokens)

### Light Mode
```css
  --color-base-100: #FAFAF9; /* Background Color */
  --color-base-200: #F5F5F4; /* Primary Surface */
  --color-base-300: #E7E5E4; /* Dividers / Borders etc */
  --color-base-content: #1C1917; /* Primary Text Color */
  --color-primary: #0F766E; /* Main Brand Color */
  --color-primary-content: #F0FDFA;
  --color-secondary: #7C3AED; /* Secondary Brand Color */
  --color-secondary-content: #F5F3FF;
  --color-accent: #EA580C; /* Ternary Brand Color */
  --color-accent-content: #FFF7ED;
  --color-neutral: #44403C; /* Neutral Brand Color */
  --color-neutral-content: #FAFAF9; /* Neutral Text Color (ligher than primary) */
  --color-info: #0EA5E9;
  --color-info-content: #F0F9FF;
  --color-success: #16A34A;
  --color-success-content: #F0FDF4;
  --color-warning: #D97706;
  --color-warning-content: #FFFBEB;
  --color-error: #DC2626;
  --color-error-content: #FEF2F2;
```
### Dark Mode
```css
  --color-base-100: #18181B; /* Background Color */
  --color-base-200: #09090B; /* Primary Surface */
  --color-base-300: #27272A; /* Dividers / Borders etc */
  --color-base-content: #FAFAFA; /* Primary Text Color */
  --color-primary: #14B8A6; /* Main Brand Color */
  --color-primary-content: #042F2E;
  --color-secondary: #A78BFA; /* Secondary Brand Color */
  --color-secondary-content: #1E1B4B;
  --color-accent: #FB923C; /* Ternary Brand Color */
  --color-accent-content: #431407;
  --color-neutral: #3F3F46; /* Neutral Brand Color */
  --color-neutral-content: #FAFAFA; /* Neutral Text Color (ligher than primary) */
  --color-info: #38BDF8;
  --color-info-content: #082F49;
  --color-success: #4ADE80;
  --color-success-content: #052E16;
  --color-warning: #FBBF24;
  --color-warning-content: #422006;
  --color-error: #F87171;
  --color-error-content: #450A0A;
```
---

## Typography System

### Font Stack
- Primary: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace

### Type Scale
- Display: 48px / 700 weight / 1.1 line-height / -0.02em letter-spacing
- H1: 36px / 700 weight / 1.2 line-height / -0.01em letter-spacing
- H2: 28px / 600 weight / 1.3 line-height / -0.01em letter-spacing
- H3: 24px / 600 weight / 1.4 line-height / normal letter-spacing
- H4: 20px / 600 weight / 1.4 line-height / normal letter-spacing
- Body Large: 18px / 400 weight / 1.6 line-height / normal letter-spacing
- Body: 16px / 400 weight / 1.5 line-height / normal letter-spacing
- Body Small: 14px / 400 weight / 1.5 line-height / normal letter-spacing
- Caption: 12px / 500 weight / 1.4 line-height / 0.01em letter-spacing
- Overline: 11px / 600 weight / 1.4 line-height / 0.08em letter-spacing / uppercase

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## Spacing System (8px Base Grid)

### Spacing Scale
- 2xs: 2px
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px
- 5xl: 128px

### Usage Guidelines
- Component padding (buttons, inputs): md (16px)
- Card padding: lg (24px) or xl (32px)
- Section spacing: 2xl (48px) to 3xl (64px)
- Page margins: xl (32px) on desktop, md (16px) on mobile
- Element gaps in flex/grid: sm (8px) to md (16px)

---

## Responsive Breakpoints

### Breakpoint Values
- Mobile: 0 - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

### Container Max Widths
- Mobile: 100% (with md padding)
- Tablet: 768px
- Desktop: 1024px
- Large Desktop: 1280px
- Extra Large: 1440px

### Responsive Behavior
- **Mobile (< 640px)**: Single column layouts, bottom navigation, hamburger menu, full-width cards, stacked forms
- **Tablet (640px - 1023px)**: 2-column grids where appropriate, collapsible sidebar, mixed navigation patterns
- **Desktop (1024px+)**: Full sidebar visible, 3-4 column grids for dashboards, side-by-side form layouts
- **Large Desktop (1440px+)**: Centered max-width content, additional whitespace, larger type scale

---

## Elevation & Shadow System

### Light Mode Shadows
- Level 0 (Flat): none
- Level 1 (Cards, Buttons): 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
- Level 2 (Dropdowns, Popovers): 0 4px 6px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)
- Level 3 (Modals, Dialogs): 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
- Level 4 (Sticky elements): 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)

### Dark Mode Shadows & Glows
- Level 0 (Flat): none
- Level 1 (Cards): 0 2px 8px rgba(0,0,0,0.4)
- Level 2 (Dropdowns): 0 8px 16px rgba(0,0,0,0.5)
- Level 3 (Modals): 0 16px 32px rgba(0,0,0,0.6)
- Accent Glow (Subtle): 0 0 20px rgba(0,245,212,0.15)
- Accent Glow (Strong): 0 0 30px rgba(157,78,221,0.3)

---

## Animation & Transitions

### Timing Functions
- Standard: cubic-bezier(0.4, 0.0, 0.2, 1)
- Decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
- Accelerate: cubic-bezier(0.4, 0.0, 1, 1)
- Sharp: cubic-bezier(0.4, 0.0, 0.6, 1)
- Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

### Duration Scale
- Instant: 100ms (micro-interactions like checkbox toggles)
- Fast: 150ms (button hovers, input focus)
- Normal: 300ms (component transitions, page element fades)
- Slow: 500ms (modal entrances, drawer slides)
- Slower: 700ms (page transitions, complex animations)

### Animation Guidelines
- Use transform and opacity only for GPU acceleration
- Hover transitions: 150ms standard easing
- Button press: scale(0.98) with 100ms duration
- Page transitions: fade + slide 20px vertically, 300ms
- Loading states: Smooth skeleton shimmer or spinner
- Scroll animations: Fade in + slide up 20px on viewport enter

---

## Border Radius System

### Radius Scale
- None: 0px
- sm: 4px (small chips, tags)
- md: 8px (buttons, inputs, small cards)
- lg: 12px (cards, modals)
- xl: 16px (large cards, images)
- 2xl: 24px (hero sections, feature blocks)
- Full: 9999px (pills, avatars, badges)

### Usage
- Buttons: md (8px) standard, full (9999px) for pill-shaped
- Input fields: md (8px)
- Cards: lg (12px) to xl (16px)
- Modals: lg (12px)
- Images: md (8px) to xl (16px)
- Avatars/Badges: full (9999px)

---

## Detailed Component Specifications

### Buttons
- **Height**: 44px (mobile/touch), 40px (desktop)
- **Padding**: 16px horizontal, 12px vertical (adjust for height)
- **Border Radius**: md (8px) for standard, full (9999px) for pill
- **Font**: 16px / 600 weight
- **Min Width**: 88px
- **States**:
  - Default: Solid fill (primary), outline (secondary), ghost (tertiary)
  - Hover: Slightly darker background, scale(1.02), shadow increase
  - Active: scale(0.98)
  - Disabled: 50% opacity, no hover effects, cursor not-allowed
  - Focus: 3px outline with accent color at 40% opacity, 2px offset

### Cards
- **Border Radius**: lg (12px)
- **Padding**: lg (24px) standard, xl (32px) for large cards
- **Border**: 1px solid (light: #E5E5E5, dark: #2A2A2F)
- **Background**: Surface color
- **Shadow**: Level 1 in light mode
- **Hover** (if interactive): Lift by 4px, increase to Level 2 shadow, 300ms transition

### Input Fields
- **Height**: 44px (mobile), 40px (desktop)
- **Border Radius**: md (8px)
- **Border**: 1.5px solid (light: #D1D5DB, dark: #3A3A3F)
- **Background**: Surface color
- **Padding**: 12px horizontal
- **Font**: 16px / 400 weight
- **States**:
  - Default: Border as specified above
  - Hover: Border color slightly darker
  - Focus: Border color to accent primary, 0 0 0 3px accent at 20% opacity
  - Error: Border color to error color, error message below in caption size
  - Disabled: 50% opacity, cursor not-allowed

### Navigation Bar (Top)
- **Height**: 64px
- **Background**: Surface with Level 1 shadow when scrolled
- **Padding**: md (16px) horizontal
- **Position**: Sticky top
- **Logo**: 32px height
- **Links**: Body font size, 600 weight, hover shows accent color

### Sidebar (App Navigation)
- **Width**: 280px expanded, 64px collapsed (icon-only)
- **Background**: Surface color with subtle border-right
- **Padding**: md (16px)
- **Item Height**: 40px
- **Item Padding**: sm (8px) vertical, md (16px) horizontal
- **Icon Size**: 20px
- **Active State**: Accent background at 10% opacity, accent text color
- **Hover State**: Background at 5% opacity

### Modals & Dialogs
- **Max Width**: 600px (standard), 900px (large), 400px (small)
- **Border Radius**: lg (12px)
- **Padding**: xl (32px)
- **Shadow**: Level 3
- **Backdrop**: rgba(0,0,0,0.5) in light, rgba(0,0,0,0.7) in dark
- **Animation**: Fade in backdrop + scale up modal from 0.95 to 1.0, 300ms

### Dropdowns & Popovers
- **Border Radius**: md (8px)
- **Padding**: sm (8px)
- **Shadow**: Level 2
- **Max Height**: 320px with scroll
- **Item Padding**: sm (8px) vertical, md (16px) horizontal
- **Item Hover**: Background at 5% opacity

### Form Layout
- **Max Width**: 600px for focused forms
- **Field Spacing**: lg (24px) vertical gap between fields
- **Label Position**: Above field with sm (8px) gap
- **Label Font**: 14px / 600 weight
- **Helper Text**: Below field, caption size (12px), secondary text color
- **Error Text**: Below field, caption size (12px), error color
- **Field Groups**: Use fieldset with legend for related fields

---

## Iconography Guidelines

### Icon System
- **Style**: Outlined with 1.5-2px stroke width for UI, filled for indicators/status
- **Sizes**: 
  - Small: 16px (inline with text)
  - Standard: 20px (buttons, navigation)
  - Medium: 24px (primary actions, headers)
  - Large: 32px (feature highlights)
- **Library**: Lucide Icons, Heroicons, Phosphor Icons, or similar modern set
- **Color**: Inherit from text color by default, accent color for primary actions
- **Spacing**: sm (8px) gap between icon and adjacent text

---

## Data Visualization Specifics

### Chart Types & Usage
- **Line Charts**: Trends over time, multiple data series
- **Bar Charts**: Comparisons across categories, horizontal for long labels
- **Area Charts**: Volume and trends, stacked for composition
- **Donut/Pie Charts**: Proportions and percentages (limit to 5-6 segments)
- **Scatter Plots**: Correlations and distributions
- **Heat Maps**: Density and patterns in large datasets

### Chart Styling
- **Colors**: Use 5-6 distinct colors from accent palette for data series
- **Color Order**: Accent Primary → Accent Secondary → Success → Info → Warning → Accent Tertiary
- **Ensure Accessibility**: Colors must be distinguishable in both light and dark modes
- **Grid Lines**: Subtle (light: #E5E5E5, dark: #2A2A2F), dashed, 1px
- **Axes**: Same color as grid lines, 1px solid
- **Labels**: 12px font size, secondary text color
- **Legend**: Body Small font, align horizontally above chart or vertically to right
- **Tooltips**: 
  - Background: Surface with Level 2 shadow
  - Border Radius: md (8px)
  - Padding: sm (8px)
  - Font: Body Small
  - Animation: Fade in 150ms

### Chart Dimensions
- **Minimum Height**: 240px for line/bar charts
- **Aspect Ratio**: 16:9 or 4:3 for most charts
- **Padding**: md (16px) around chart area
- **Responsive**: Reduce height on mobile, maintain legibility

### Chart Animations
- **Initial Load**: Animate data points/bars from 0 to value over 600ms
- **Hover**: Highlight data point with scale(1.1) and show tooltip
- **Update**: Smooth transition between data states over 400ms

---

## Common Layout Patterns

### Dashboard Layout
- **Sidebar**: 280px wide, collapsible to 64px icon-only on desktop
- **Top Bar**: 64px height, sticky, contains breadcrumbs/search/user menu
- **Content Area**: 
  - Max width: 1440px
  - Padding: xl (32px) on desktop, md (16px) on mobile
  - Background: Background Primary color
- **Grid System**: 
  - 4 columns on desktop (1440px+)
  - 3 columns on desktop (1024-1439px)
  - 2 columns on tablet (640-1023px)
  - 1 column on mobile (< 640px)
  - Gap: lg (24px)

### Landing Page Layout
- **Hero Section**: 
  - Min height: 600px
  - Padding: 4xl (96px) vertical
  - Centered content, max-width 1024px
  - Gradient background (light mode) or solid with glow accents (dark mode)
- **Feature Sections**: 
  - Alternating left/right image-text blocks
  - Padding: 3xl (64px) vertical
  - Max width: 1280px
- **Grid Sections**: 
  - 3 columns on desktop, 2 on tablet, 1 on mobile
  - Equal height cards with lg (24px) padding

### Form Layout (Full-Page)
- **Container**: 
  - Max width: 600px
  - Centered with auto margins
  - Padding: xl (32px)
  - Can use card background on larger screens
- **Field Spacing**: lg (24px) vertical gap between fields
- **Label Position**: Above field with sm (8px) gap
- **Button Group**: Right-aligned with sm (8px) gap between buttons
- **Multi-Step**: Progress indicator at top, 48px height

### Data Table Layout
- **Container**: Full width with horizontal scroll on mobile
- **Row Height**: 52px standard
- **Cell Padding**: md (16px) horizontal, sm (8px) vertical
- **Header**: 
  - Background: Slightly darker than surface
  - Font: 14px / 600 weight
  - Border bottom: 2px solid border color
- **Rows**: 
  - Hover: Background at 3% opacity
  - Selected: Accent background at 8% opacity
  - Border bottom: 1px solid divider color
- **Actions Column**: Right-aligned, 80-120px fixed width
- **Pagination**: Bottom-right, 44px button height

---

## Loading & Empty States

### Loading States
- **Skeleton Screens**: 
  - Use for card-based layouts
  - Animate with shimmer effect (gradient moving left to right)
  - Border radius matches actual component
  - Background: Divider color
- **Spinners**: 
  - Use for buttons and small areas
  - Size: 20px standard, 16px small, 24px large
  - Color: Accent primary or current text color
  - Animation: Smooth rotation, 800ms duration

### Empty States
- **Illustration**: 160px size, centered
- **Heading**: H3 size, centered
- **Description**: Body text, secondary color, centered, max-width 480px
- **Action Button**: Primary CTA to resolve empty state
- **Padding**: 3xl (64px) vertical
- **Examples**: "No data yet", "No results found", "Get started"

---

## Error & Success States

### Error Messages
- **Inline (Form Fields)**: Caption size, error color, below field with xs (4px) gap
- **Toast/Snackbar**: 
  - Background: Error color
  - Text: White
  - Border radius: md (8px)
  - Padding: md (16px)
  - Position: Top-right or bottom-center
  - Duration: 5000ms
  - Animation: Slide in from edge
- **Error Page**: 
  - Centered content
  - Large error illustration
  - H1 error code (404, 500, etc.)
  - Body description
  - Primary button to return/retry

### Success States
- **Toast/Snackbar**: Same as error but with success color
- **Checkmark Animation**: Scale in with bounce easing, 400ms
- **Success Page**: Similar to error page but with success illustration

---

## Z-Index Scale

Use consistent z-index values to avoid layering conflicts:

- Base: 0
- Dropdown: 1000
- Sticky: 1020
- Fixed: 1030
- Modal Backdrop: 1040
- Modal: 1050
- Popover: 1060
- Tooltip: 1070
- Toast: 1080

---

## Print Styles (Optional)

For applications that may be printed:

- Remove backgrounds and shadows
- Use black text on white background
- Hide navigation, sidebars, and non-essential elements
- Expand collapsed sections
- Ensure charts are visible and legible
- Add page break controls for long content

--- END UI CONTEXT ---

--- CODEBASE ARCHITECTURE (REPO MAP) ---
# NextJS General Repository Map
This documents a production-ready Next.js 16 application with React 19 and Tailwindcss v4, featuring Auth0 authentication, server actions for type-safe API communication, and Axios-based data fetching with automated cache revalidation. The architecture uses Zod validation for all CRUD operations, TypeScript interfaces matching the backend schema, and a middleware-protected routing system with built-in error handling. 

**Do NOT recreate the following files/directories:**
* **Core Libraries:** (api-client.ts, api-client-utils.ts, auth0.ts, proxy.ts)
* **Example Actions/Types:** (frontend/next/src/types/users.ts, frontend/next/src/actions/users/validators.ts, frontend/next/src/actions/users/index.ts)

**Usage Example:** When creating new components or pages, utilize the existing Server Actions structure as demonstrated below for data fetching:
{
  # Example code from the user's prompt (formatted for TSX)
  # You would need to load this snippet into a variable called users_example_code
  # The formatting here is to represent the content of that variable
}
```tsx
'use client';
import {{ useState, useEffect }} from 'react';
import {{ findUsers }} from '@/actions/users';
import {{ Users }} from '@/types/users';

export default function UsersPage() {{
  // ... (omitted implementation) ...
  useEffect(() => {{
    const fetchUsers = async () => {{
      const res = await findUsers({{ limit: 10 }});
      // ... (handle res.success and res.data) ...
    }};
    fetchUsers();
  }}, []);
  // ...
}}
```

## Dependencies
```json
{
  "dependencies": {
    "@auth0/nextjs-auth0": "^4.13.1",
    "@headlessui/react": "^2.2.9",
    "axios": "^1.13.2",
    "lucide-react": "^0.456.0",
    "next": "16.0.7",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@tailwindcss/typography": "^0.5.19",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "daisyui": "^5.5.11",
    "eslint": "^9",
    "eslint-config-next": "16.0.7",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

# IMPORTANT BUILD GUIDELINESS FOR NEXT APP
- When using values, be sure to parse them first to avoid mistakes with strings.
```ts
Number(exp.amount); // Not just exp.amount
```
- When using `GET` endpoints for queries, limit pagination to be under 100 results (default of 10-25 results).
  - `GET` endpoints using pagination return the following data:
```ts
interface PaginationResult {
  success: boolean;
  data: T[];  // Array of entities from the database
  nextCursor: string | null;  // Cursor used for cursor-based pagination
  hasNextPage: boolean; // Boolean to determine if there is another valid page
}
```

# NAMING CONVENTIONS
- Variables, Functions, and Methods: Use camelCase (e.g., userName, getUsersList()).
- Interfaces, Types, and Classes: Use PascalCase (e.g., UserProps, ApiContext)
- Enums and Constants: Use PascalCase for enum members and UPPER_CASE_SNAKE_CASE for global, immutable compile-time constants (e.g., API_URL).
- Private Properties: Do not use leading or trailing underscores for private properties or methods. 

- Plain TypeScript File Names: Use kebab-case for general files (e.g., user-expense.ts)
- .tsx (React) TypeScript File Names: Use pascal-case for files (e.g., UserCard.tsx)

- ALL ENTITY RELATED NAMES ARE ALSO PLURAL (ie users, categories, createUsers, getCategories, etc.)

## File: frontend/next/src/actions/{table}/index.ts
UNIQUE CRUD FUNCTIONS FOR AN ENTITY

Users example:
```ts
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/api-client";
import { 
  handleAxiosError, 
  ActionResponse 
} from "@/lib/api-client-utils";
import {
  usersValidator,
  CreateUsersInput,
  QueryUsersInput,
  UpdateUsersInput,
} from "./validators";
import type { Users } from "@/types/users";
// Resource name for API endpoint
const resource = "users";
// Paths to revalidate after mutations
const revalidatePaths = ["/users", "/dashboard"];
// Creates a new user with validation and cache revalidation.
export async function createUsers(input: CreateUsersInput): Promise<ActionResponse<Users>> { /* ... implementation omitted ... */ }
// Queries users with optional filters.
export async function findUsers(query?: Partial<QueryUsersInput>): Promise<ActionResponse<Users[]>> { /* ... implementation omitted ... */ }
// Retrieves a single user by ID.
export async function getUsers(id: string): Promise<ActionResponse<Users>> { /* ... implementation omitted ... */ }
// Updates an existing user with validation and cache revalidation.
export async function updateUsers(id: string, input: UpdateUsersInput): Promise<ActionResponse<Users>> { /* ... implementation omitted ... */ }
// Deletes a user by ID with cache revalidation.
export async function deleteUsers(id: string): Promise<ActionResponse<void>> { /* ... implementation omitted ... */ }
```

## File: frontend/next/src/actions/{table}/validator.ts
UNIQUE ZOD VALIDATOR SCHEMAS FOR THE ENTITY'S BODY/QUERY/PARAMS

Users example:
```ts
import { z } from "zod";
// Valid columns for sorting users
export const usersSortColumns = [...] as const;
// Base schema with all user fields optional
const base = z.object({ /* ... implementation omitted ... */ });
// Defines validator for the Users object
export const usersValidator = {
  // Validates UUID format for ID params
  id: z.object({ /* ... implementation omitted ... */ }),
  // Validates required fields (NOT NULL)
  create: base.required({ /* ... implementation omitted ... */ }),
  // Validates query parameters with defaults for pagination and sorting
  query: base.extend({ /* ... implementation omitted ... */ }),
  // Validates that at least one field is present
  update: base.refine({ /* ... implementation omitted ... */ }),
};
// Exports input validation for schema (Create / Query / Update)
```

## File: frontend/next/src/lib/api-client-utils.ts
HELPER METHODS AND INTERFACES FOR (frontend/next/src/lib/api-client.ts)
```ts
import axios, { AxiosError } from "axios";
import { ZodType } from "zod";
// Defines the structure of responses from Axios requests
export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
  error?: string;
};// Defines the structure of errors from Axios requests
interface ApiErrorResponse {
  success: false;
  errors?: Array<{ path: string; message: string }>;
  error?: string;
}// Generic handlers for Axios requests
export function handleAxiosError<T>(error: unknown): ActionResponse<T> { /* ... implementation omitted ... */ }
// Defines validators for CRUD operations
export interface CrudValidators<TCreate, TQuery, TUpdate> {
  create: ZodType<TCreate>;
  query: ZodType<TQuery>;
  update: ZodType<TUpdate>;
}
// Defines options for CRUD operations
export interface CrudOptions {
  resource: string;
  revalidatePaths?: string[];
}
```

## File: frontend/next/src/lib/api-client.ts
DEFINE AND CONFIGURE AXIOS INSTANCE
```ts
"use server";
import axios, { AxiosInstance } from "axios";
import { auth0 } from "./auth0";
// Retrieves access token from Auth0
// Fetches API credentials (url and API version)
// Initializes and sends axios request
export async function createApiClient(resource: string): Promise<AxiosInstance> { /* ... implementation omitted ... */ }
```

## File: frontend/next/src/lib/auth0.ts
```ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";
// Initializes Auth0 client by passing in relevant credentials
export const auth0 = new Auth0Client({ /* ... implementation omitted ... */ });
```

## File: frontend/next/src/proxy.ts
AUTH0 MIDDLEWARE USED FOR ALL PROTECTED REQUESTS
```ts
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";
// Create middleware for Auth0 Authentication
export async function proxy(request: NextRequest) {
  return await auth0.middleware(request);
}
/*
  * Match all request paths except for the ones starting with:
  * - _next/static (static files)
  * - _next/image (image optimization files)
  * - favicon.ico, sitemap.xml, robots.txt (metadata files)
  */
export const config = { /* ... implementation omitted ... */ };
```

## File: frontend/next/src/types/
SERIES OF TYPESCRIPT TYPES FOR EACH ENTITY IN THE DATABASE
```ts
// Exports type that matches the users entity in the database
export interface Users {
  id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}
```

## File: frontend/next/src/app/
THIS DIRECTORY IS WHERE THE MAIN UI IS DEFINED AND IMPLEMENTED

Example for calling our actions in a page:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { findUsers } from '@/actions/users';
import { Users } from '@/types/users';
// Define the page for the app
export default function UsersPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  // Use hooks to call the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await findUsers({ limit: 10 });
      if (res.success && res.data) {
        setUsers(res.data);
      }
      setLoading(false);
    };
  fetchUsers();
  }, []);
  // THE REST OF IMPLEMENTATION HAS BEEN OMITTED FOR COMPRESSION PURPOSES
}
```

## File: frontend/next/src/components/
THIS DIRECTORY IS WHERE THE REUSABLE UI COMPONENTS ARE DEFINED AND IMPLEMENTED

## File: frontend/next/src/providers/
THIS DIRECTORY IS WHERE THE  THE APP'S CONTEXT AND CONTEXT PROVIDERS ARE DEFINED

# Next.js Components Repository Map

This document provides a reference for all reusable UI components in the Next.js application. Each component is documented with its interface, parameters, and usage patterns, omitting implementation details for context compression.

## Component Directory Structure

```
templates/next_base/src/components/
├── AppBar.tsx              # Main navigation bar with auth
├── AppDrawer.tsx           # Sidebar navigation drawer
├── LoginButton.tsx         # Auth0 login button
├── LogoutButton.tsx        # Auth0 logout button
└── ui/                     # Reusable UI components
    ├── Badge.tsx
    ├── Button.tsx
    ├── Card.tsx
    ├── DatePicker.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── Select.tsx
    ├── Skeleton.tsx
    ├── Toast.tsx
    └── index.ts            # Re-exports all UI components
```

---

## Layout Components

### AppBar

Main navigation bar with theme toggle, user menu, and Auth0 authentication integration.

```tsx
export default function AppBar()
```

**Dependencies:**
- `useTheme()` from `@/providers/ThemeProvider`
- `useDrawer()` from `@/providers/DrawerProvider`
- `useUser()` from `@auth0/nextjs-auth0`
- `@/lib/constants` for app configuration

**Features:**
- Automatic theme switching (light/dark)
- User authentication state display
- Drawer menu toggle
- Responsive design (mobile-optimized)
- Dashboard and settings navigation when authenticated

---

### AppDrawer

Side navigation drawer with Auth0 user info and navigation items.

```tsx
export default function AppDrawer()

interface NavigationItem {
  href: string;
  label: string;
  icon: ElementType;
  protected?: boolean;  // Only show if user is authenticated
}
```

**Dependencies:**
- `useDrawer()` from `@/providers/DrawerProvider`
- `useUser()` from `@auth0/nextjs-auth0`
- `usePathname()` from `next/navigation`
- `@headlessui/react` for Dialog/Transition components

**Features:**
- Displays user profile picture and info when authenticated
- Filters navigation items based on auth state
- Active route highlighting
- Smooth slide-in/out animations
- Backdrop blur overlay

**Configuration:**
Edit the `navigationItems` array to add custom navigation:

```tsx
const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
  // Add more items...
];
```

---

### LoginButton

Simple Auth0 login button with user avatar display when authenticated.

```tsx
export default function LoginButton()
```

**Dependencies:**
- `useUser()` from `@auth0/nextjs-auth0/client`

**Behavior:**
- Shows loading skeleton during auth check
- Displays user avatar when logged in (links to `/dashboard`)
- Shows "Log In" link when not authenticated

---

### LogoutButton

Auth0 logout button component.

```tsx
export default function LogoutButton()
```

**Features:**
- Simple link to `/auth/logout`
- Styled with hover effects and transitions
- Hidden on mobile (`hidden sm:block`)

---

## UI Components

### Badge

Display tags, categories, or status indicators.

```tsx
export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps)

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}
```

**Variants:**
- `default`: Neutral gray background
- `primary`: Primary theme color
- `secondary`: Secondary theme color
- `success`: Green success color
- `warning`: Yellow/orange warning color
- `error`: Red error color
- `info`: Blue info color

**Sizes:**
- `sm`: Small badge (text-xs, compact padding)
- `md`: Medium badge (text-sm, regular padding)

**Usage:**

```tsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="error">Failed</Badge>
```

---

### Button

Flexible button component with variants, sizes, loading states, and icon support.

```tsx
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  ...props
}: ButtonProps)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

**Variants:**
- `primary`: Primary action button (filled, primary color)
- `secondary`: Secondary action button (filled, secondary color)
- `danger`: Destructive action button (filled, error color)
- `ghost`: Transparent button with hover background
- `outline`: Bordered button with transparent background

**Sizes:**
- `sm`: Small button (text-sm, compact padding)
- `md`: Medium button (text-base, regular padding)
- `lg`: Large button (text-lg, spacious padding)

**Features:**
- Automatic loading spinner when `loading={true}`
- Icons can be placed on left or right side
- Disabled state styling
- Full-width option
- Accessible focus states

**Usage:**

```tsx
<Button variant="primary" size="lg" loading={isSubmitting}>
  Submit
</Button>

<Button variant="ghost" leftIcon={<Plus />}>
  Add Item
</Button>

<Button variant="danger" fullWidth>
  Delete Account
</Button>
```

---

### Card

Flexible card container with header, title, content, and footer subcomponents.

```tsx
export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  onClick,
}: CardProps)

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}
```

**Subcomponents:**

```tsx
export function CardHeader({ children, className = "" }: CardHeaderProps)
export function CardTitle({ children, className = "" }: CardTitleProps)
export function CardContent({ children, className = "" }: CardContentProps)
export function CardFooter({ children, className = "" }: CardFooterProps)
```

**Variants:**
- `default`: Simple flat background
- `elevated`: Shadow with hover effect
- `bordered`: Border outline

**Padding:**
- `none`: No padding
- `sm`: Small padding (p-3)
- `md`: Medium padding (p-5)
- `lg`: Large padding (p-8)

**Usage:**

```tsx
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <Button size="sm">Edit</Button>
  </CardHeader>
  <CardContent>
    {/* content here */}
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

### DatePicker

Date input component with label, error, and hint support.

```tsx
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => { /* ... */ }
)

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
}
```

**Features:**
- Calendar icon decoration
- Error state styling
- Optional label and hint text
- Supports all standard HTML input attributes (except `type`)
- Forward ref support for form libraries

**Usage:**

```tsx
<DatePicker
  label="Birth Date"
  hint="Select your date of birth"
  error={errors.birthDate}
  {...register("birthDate")}
/>
```

---

### Input

Text input component with label, icons, error, and hint support.

```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = "", id, ...props }, ref) => { /* ... */ }
)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Features:**
- Optional left/right icon slots
- Error state styling with error message display
- Label and hint text support
- Auto-adjusts padding for icons
- Forward ref support for form libraries
- Supports all standard HTML input attributes

**Usage:**

```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  leftIcon={<Mail className="w-5 h-5" />}
  error={errors.email?.message}
  hint="We'll never share your email"
  {...register("email")}
/>
```

---

### Modal

Accessible modal dialog with animations and flexible sizing.

```tsx
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps)

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}
```

**Subcomponents:**

```tsx
export function ModalFooter({ children, className = "" }: ModalFooterProps)
```

**Dependencies:**
- `@headlessui/react` for accessible dialog primitives

**Sizes:**
- `sm`: max-w-sm (384px)
- `md`: max-w-md (448px)
- `lg`: max-w-lg (512px)
- `xl`: max-w-xl (576px)

**Features:**
- Backdrop blur overlay
- Smooth enter/exit animations
- Close button in header
- Click outside to close
- Escape key to close
- Focus trap

**Usage:**

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  size="sm"
>
  <p>Are you sure you want to delete this item?</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

---

### Select

Dropdown select component with label, error, and hint support.

```tsx
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder = "Select an option", className = "", id, ...props }, ref) => { /* ... */ }
)

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

interface SelectOption {
  value: string;
  label: string;
}
```

**Features:**
- Custom chevron icon
- Error state styling
- Required `options` array prop
- Customizable placeholder
- Forward ref support for form libraries
- Supports all standard HTML select attributes

**Usage:**

```tsx
const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

<Select
  label="Status"
  options={statusOptions}
  placeholder="Choose a status"
  error={errors.status?.message}
  {...register("status")}
/>
```

---

### Skeleton

Loading placeholder components with animation.

```tsx
export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps)

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}
```

**Pre-built Skeleton Components:**

```tsx
export function SkeletonCard()
export function SkeletonTable({ rows = 5 }: { rows?: number })
export function SkeletonChart()
```

**Variants:**
- `text`: Rounded corners (for text lines)
- `circular`: Fully rounded (for avatars)
- `rectangular`: Large rounded corners (for boxes)

**Features:**
- Pulse animation
- Customizable dimensions
- Pre-built layouts for common patterns

**Usage:**

```tsx
// Basic skeleton
<Skeleton variant="text" width="60%" height="1.5rem" />
<Skeleton variant="circular" width={40} height={40} />

// Pre-built patterns
{isLoading ? <SkeletonCard /> : <UserCard data={user} />}
{isLoading ? <SkeletonTable rows={10} /> : <DataTable data={items} />}
```

---

### Toast

Toast notification system with provider and container.

```tsx
export function Toast({
  id,
  message,
  type,
  onClose,
  duration = 5000,
}: ToastProps)

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export type ToastType = "success" | "error" | "info" | "warning";
```

**Container Component:**

```tsx
export function ToastContainer({ toasts, onClose }: ToastContainerProps)

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onClose: (id: string) => void;
}
```

**Toast Types:**
- `success`: Green checkmark icon
- `error`: Red alert circle icon
- `info`: Blue info icon
- `warning`: Yellow/orange warning triangle

**Features:**
- Auto-dismiss after duration (default 5000ms)
- Manual close button
- Slide-in animation
- Stacks in bottom-right corner
- Color-coded by type

**Note:** Use with `ToastProvider` (see Providers section below)

---

## Providers

### ToastProvider

Context provider for toast notifications throughout the app.

```tsx
export function ToastProvider({ children }: { children: ReactNode })

export function useToast(): ToastContextType

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}
```

**Setup:**

```tsx
// In your root layout or app wrapper
import { ToastProvider } from "@/providers/ToastProvider";

export default function RootLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

**Usage:**

```tsx
'use client';
import { useToast } from "@/providers/ToastProvider";

function MyComponent() {
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await saveData();
      toast.success("Data saved successfully!");
    } catch (error) {
      toast.error("Failed to save data");
    }
  };

  // Or use the generic method
  toast.showToast("Processing...", "info");
}
```

---

## UI Component Index

The `ui/index.ts` file re-exports all UI components for convenient importing:

```tsx
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
export { Button } from "./Button";
export { Input } from "./Input";
export { Select } from "./Select";
export { Modal, ModalFooter } from "./Modal";
export { Badge } from "./Badge";
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart } from "./Skeleton";
export { Toast, ToastContainer } from "./Toast";
export type { ToastType } from "./Toast";
export { DatePicker } from "./DatePicker";
```

**Usage:**

```tsx
// Import from ui/index
import { Button, Card, CardHeader, Input } from "@/components/ui";

// Instead of individual imports
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
```

---

## Design System Notes

### Theme Colors

All components use CSS variables from the Tailwind theme:

- `base-100`, `base-200`, `base-300`: Background and surface colors
- `base-content`: Text color (adapts to theme)
- `primary`, `primary-content`: Primary brand colors
- `secondary`, `secondary-content`: Secondary colors
- `success`, `error`, `warning`, `info`: Semantic colors

### Responsive Design

Most components are mobile-first and include responsive breakpoints:

- `sm:`: Small screens (640px+)
- `md:`: Medium screens (768px+)
- `lg:`: Large screens (1024px+)

### Accessibility

All components include:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus states and indicators
- Screen reader compatibility
- Semantic HTML elements

### Form Integration

Input components (`Input`, `Select`, `DatePicker`) use `forwardRef` for seamless integration with form libraries like React Hook Form:

```tsx
import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui";

function MyForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <Input
        label="Username"
        error={errors.username?.message}
        {...register("username", { required: "Username is required" })}
      />
    </form>
  );
}
```

---

## Common Patterns

### Loading States

```tsx
{isLoading ? (
  <SkeletonCard />
) : (
  <Card>
    {/* content */}
  </Card>
)}
```

### Form with Validation

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  hint="Enter your work email"
  {...register("email")}
/>
```

### Action Buttons

```tsx
<div className="flex gap-2 justify-end">
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="primary" loading={isSubmitting}>
    Save Changes
  </Button>
</div>
```

### Status Indicators

```tsx
<Badge variant={status === "active" ? "success" : "error"}>
  {status}
</Badge>
```

### Notifications

```tsx
const toast = useToast();

toast.success("Operation completed!");
toast.error("Something went wrong");
toast.warning("Please review your input");
toast.info("New message received");
```

--- END REPO MAP ---

Break this into sequential phases following the strategy above:
1. Start with Foundation (shared components, utilities, hooks)
2. Then Core Dashboard (main landing/dashboard page)
3. Then one phase per major feature/entity
4. End with Settings/Auxiliary pages

For each file, specify its dependencies so generation order is correct.
Aim for 6-12 files per phase (except foundation which can be larger).

Make it production-ready with proper loading states, error handling, and responsive design.

--- THE DEVELOPMENT GOAL ---
GOAL: Implement the full set of Next.js pages and components required to meet the specifications detailed in the PRD, adhering strictly to the architectural patterns defined in the REPO MAP (e.g., using Server Actions via 'frontend/next/src/actions/' and Zod validation).

--- IMPLEMENTATION STRATEGY ---
Generate files in the order shown above:
1. Utilities/Hooks FIRST - foundation functions and state management
2. Constants/Providers SECOND - configuration and context
3. Components THIRD - reusable UI pieces (import utils/hooks)
4. Pages LAST - compose components together (import everything)

When generating:
- Earlier files should be standalone or have minimal dependencies
- Later files should IMPORT and USE earlier files
- Pages should compose components, not duplicate logic
- Ensure proper import paths (use @/ for absolute imports)

Key principles:
- Build from bottom up (utils → components → pages)
- Each file should properly import dependencies
- Components should be reusable
- Pages should compose components
- No code duplication
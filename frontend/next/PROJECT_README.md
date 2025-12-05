# Lucky Bee Press - Wholesale B2B Platform

A professional B2B wholesale e-commerce platform for Lucky Bee Press letterpress greeting cards, built with Next.js 16, designed for independent retail stores.

## 🎯 Project Overview

This is a Faire.com-inspired wholesale platform that enables retail stores to browse, order, and manage purchases of handcrafted letterpress greeting cards at wholesale prices.

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2.0
- **Styling**: Tailwind CSS with custom color scheme
- **Authentication**: Auth0 (@auth0/nextjs-auth0)
- **UI Components**: @headlessui/react
- **Icons**: react-icons
- **HTTP Client**: axios
- **Language**: TypeScript

## 🎨 Design System

### Color Palette (B2B Wholesale Theme)

```css
--color-base-100: #F7F5F3  /* Lightest background */
--color-base-200: #F3EDE9  /* Secondary background */
--color-base-300: #E2DDD9  /* Borders, dividers */
--color-base-content: #4B4743  /* Primary text */

--color-primary: #FFC72C  /* Main CTA buttons - warm honey */
--color-secondary: #F2A900  /* Accents */

--color-neutral: #161616  /* Dark text/elements */
--color-neutral-content: #C2BDB9  /* Muted text */

--color-info: #78C8FF
--color-success: #AFD89E
--color-warning: #EFC375
--color-error: #FF7878
```

### Typography

- **Primary Font**: Poppins (body text, UI elements)
- **Secondary Font**: Outfit (headings, serif accents)

### Design Philosophy

- Clean, professional B2B aesthetic
- Warm, artisan feel reflecting handcrafted letterpress work
- Mobile-first responsive design
- Good whitespace and breathing room
- Elegant typography with serif accents for headings

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── account/                  # Customer account dashboard
│   │   └── addresses/            # Address management
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Multi-step checkout flow
│   │   └── success/             # Order confirmation
│   ├── orders/                   # Order history & tracking
│   │   └── [id]/                # Individual order details
│   ├── products/                 # Product catalog
│   │   └── [id]/                # Product detail pages
│   ├── contact/                  # Contact form
│   └── page.tsx                  # Homepage with B2B messaging
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx (+ Textarea, Select)
│   │   ├── Loading.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Navigation.tsx        # Main nav with cart badge
│   │   ├── Footer.tsx
│   │   └── index.ts
│   └── product/                  # Product-specific components
│       ├── ProductCard.tsx
│       ├── ProductFilters.tsx
│       └── index.ts
│
├── lib/
│   ├── mock-data.ts             # Mock products, orders, customers
│   ├── cart-context.tsx         # Shopping cart state management
│   └── ...
│
└── types/                        # TypeScript type definitions
    ├── products.ts
    ├── orders.ts
    ├── customers.ts
    └── ...
```

## ✨ Features Implemented

### 1. **Product Catalog** (`/products`)
- Grid layout with product cards
- Filter by category
- Sort by name, price, newest, popular
- Responsive design (1-4 columns)
- Shows wholesale pricing for authenticated users
- "Sign in to view pricing" for guests

### 2. **Product Detail Pages** (`/products/[id]`)
- Large product image
- Full product information
- Wholesale price (WSP) and Suggested Retail Price (SRP)
- Margin calculation
- Minimum order quantity enforcement
- Stock availability
- Add to cart functionality
- Quantity controls

### 3. **Shopping Cart** (`/cart`)
- View all cart items
- Update quantities
- Remove items
- Minimum order quantity validation
- Subtotal calculation
- Shipping cost calculation (free over $500)
- Cart badge in navigation
- Persistent cart (localStorage)

### 4. **Multi-Step Checkout** (`/checkout`)
- **Step 1: Shipping Information**
  - Company and contact details
  - Full address form
  - Phone number
- **Step 2: Payment Terms**
  - Net 30 / Net 60 options
  - PO number (optional)
  - Order notes
- **Step 3: Review & Place Order**
  - Summary of all information
  - Edit any step
  - Final order confirmation
- Order success page with confirmation number

### 5. **Customer Account Dashboard** (`/account`)
- Account overview with stats
  - Total orders
  - Lifetime value
  - Payment terms
- Recent orders
- Quick actions
- Account information display

### 6. **Order History & Tracking** (`/orders`)
- List all orders with filtering
- Order status badges
- Click to view details

### 7. **Order Detail Pages** (`/orders/[id]`)
- Full order information
- Shipping address
- Payment terms and due dates
- Tracking information
- Order status timeline
- Download invoice button
- Contact support

### 8. **Address Management** (`/account/addresses`)
- View all saved addresses
- Set default address
- Add new addresses
- Edit existing addresses
- Delete addresses

### 9. **Homepage** (`/`)
- Hero section with B2B messaging
- Why choose us section
- Featured products
- Shop by category
- Call-to-action for account creation

### 10. **Navigation & Layout**
- Sticky navigation with logo
- Cart badge showing item count
- Mobile-responsive menu
- Footer with links and contact info

### 11. **Contact Page** (`/contact`)
- Contact form
- Business hours
- Email and phone
- Location information

## 🔐 Authentication

The platform uses Auth0 for authentication:

- Protected routes require login
- Guest users can browse but not see pricing
- Account, cart, checkout, and orders require authentication
- User context available throughout app via `useUser()` hook

## 💾 Data Management

### Cart State
- Uses React Context API (`CartProvider`)
- Persists to localStorage
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`

### Mock Data
All data is currently mocked in `src/lib/mock-data.ts`:
- 12 sample products across multiple categories
- 3 sample orders
- 2 sample customers
- Helper functions for formatting and calculations

### Ready for Backend Integration
The app is structured to easily integrate with your existing backend:
- Types match backend schema
- Actions/validators already set up in `src/actions/`
- API client utilities ready in `src/lib/`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend/next
npm install
```

### Environment Variables

Create `.env.local`:

```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'

# API Configuration (for future backend integration)
NEXT_PUBLIC_API_URL='http://localhost:8000/api'
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Key User Flows

### Guest User Flow
1. Browse homepage → See featured products
2. Click "Browse Catalog" → View products (no pricing shown)
3. Click product → See "Sign in to view pricing" message
4. Click "Sign In" → Auth0 login

### Authenticated Retailer Flow
1. Sign in → See wholesale pricing throughout site
2. Browse products → Filter by category, sort by criteria
3. Click product → View full details with WSP/SRP
4. Add to cart → Adjust quantity (respecting MOQ)
5. View cart → Review items, see shipping calculation
6. Checkout → 3-step process (shipping, payment, review)
7. Place order → Get confirmation and order number
8. Track order → View in order history with status updates

### Account Management Flow
1. Go to account → Dashboard with stats and recent orders
2. View orders → Filter and search all orders
3. Click order → See full details and tracking
4. Manage addresses → Add/edit/delete shipping addresses
5. Contact support → Use contact form for inquiries

## 🎯 B2B-Specific Features

1. **Wholesale Pricing Display**
   - WSP (Wholesale Price) and SRP (Suggested Retail Price)
   - Margin calculation for retailer reference

2. **Minimum Order Quantities**
   - Enforced at product and cart level
   - Clear messaging about MOQ requirements

3. **Net Payment Terms**
   - Net 30 and Net 60 options
   - Payment due dates calculated from order date

4. **Professional Terminology**
   - "Wholesale Portal" instead of "Shop"
   - "Order" instead of "Purchase"
   - Business-focused language throughout

5. **Volume Discounts** (displayed in account)
   - Percentage discount for high-volume customers
   - Lifetime value tracking

6. **PO Numbers**
   - Optional purchase order number field
   - For retailers' internal tracking

## 🔄 Next Steps for Production

### Backend Integration
1. Connect to your existing Deno backend
2. Replace mock data with API calls
3. Implement real cart persistence
4. Add real order submission
5. Connect to payment processing

### Additional Features to Consider
1. **Product Images**
   - Upload real product photos
   - Multiple images per product
   - Image zoom functionality

2. **Search**
   - Full-text product search
   - Search by SKU

3. **Reorder Functionality**
   - Quick reorder from order history
   - Save favorite products

4. **Invoicing**
   - PDF invoice generation
   - Download/email invoices

5. **Sales Rep Portal**
   - Separate interface for sales team
   - Customer management
   - Order processing

6. **Analytics Dashboard**
   - Sales metrics
   - Popular products
   - Customer insights

7. **Email Notifications**
   - Order confirmations
   - Shipping notifications
   - Payment reminders

8. **Advanced Filtering**
   - Price range
   - Stock availability
   - Multiple categories

## 📝 Notes

- All data is currently mocked for demonstration
- Cart persists in localStorage
- Auth0 configuration required for authentication
- Mobile-responsive throughout
- Follows Next.js 16 best practices
- TypeScript for type safety
- Component-based architecture for reusability

## 🤝 Contributing

When adding new features:
1. Follow the existing component structure
2. Use the established color scheme
3. Maintain B2B professional language
4. Ensure mobile responsiveness
5. Add TypeScript types
6. Keep accessibility in mind

## 📄 License

This project is proprietary to Lucky Bee Press.

---

Built with ❤️ for Lucky Bee Press wholesale partners


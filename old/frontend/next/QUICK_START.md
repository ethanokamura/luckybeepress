# Lucky Bee Press - Quick Start Guide

## 🎉 What's Been Built

Your B2B wholesale e-commerce platform is now complete! Here's what you have:

### ✅ All Features Implemented

1. **Homepage** - Professional B2B landing page with featured products and categories
2. **Product Catalog** - Filterable, sortable grid of letterpress cards
3. **Product Details** - Individual product pages with wholesale/retail pricing
4. **Shopping Cart** - Full cart management with persistent storage
5. **Checkout Flow** - 3-step checkout (shipping, payment, review)
6. **Account Dashboard** - Customer overview with stats and recent orders
7. **Order History** - Complete order tracking and management
8. **Order Details** - Individual order pages with tracking info
9. **Address Management** - Save and manage multiple shipping addresses
10. **Contact Page** - Professional contact form
11. **Navigation & Footer** - Complete layout with cart badge
12. **UI Components** - Reusable component library

## 🚀 Running the Application

### 1. Install Dependencies

```bash
cd /Users/ethanokamura/Main/luckybeepress/frontend/next
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the `next` directory:

```env
AUTH0_SECRET='use-a-long-random-string-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR-AUTH0-DOMAIN.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
```

**Note**: You'll need to set up an Auth0 account at https://auth0.com if you haven't already.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🎨 Color Scheme

The platform uses a warm, professional B2B color scheme:

- **Primary (Yellow/Honey)**: `#FFC72C` - Main CTAs, highlights
- **Secondary (Amber)**: `#F2A900` - Accents
- **Neutral Backgrounds**: `#F7F5F3`, `#F3EDE9`, `#E2DDD9`
- **Text**: `#4B4743`, `#161616`
- **Status Colors**: Success, Warning, Error, Info

All colors are defined in `src/app/globals.css` as CSS variables.

## 📱 Key Pages to Test

### As a Guest (Not Logged In):
- **/** - Homepage with B2B messaging
- **/products** - Product catalog (prices hidden)
- **/products/prod_001** - Product detail (shows "Sign in to view pricing")
- **/contact** - Contact form

### As an Authenticated User:
1. Click "Sign In" or "Create Account" in the navigation
2. Log in through Auth0
3. Test these pages:
   - **/products** - Now shows wholesale pricing
   - **/products/prod_001** - Can add to cart
   - **/cart** - Shopping cart management
   - **/checkout** - Multi-step checkout
   - **/account** - Dashboard with stats
   - **/orders** - Order history
   - **/orders/order_001** - Order details
   - **/account/addresses** - Address management

## 📊 Mock Data

The app currently uses mock data from `src/lib/mock-data.ts`:

- **12 Products**: Various letterpress cards (Birthday, Thank You, Holiday, etc.)
- **3 Orders**: Sample orders in different statuses
- **2 Customers**: Sample wholesale customers
- **Helper Functions**: Currency formatting, date formatting, status colors

### Mock Product Categories:
- Birthday
- Thank You
- Congratulations
- Anniversary
- Sympathy
- Holiday
- Baby
- Graduation
- Just Because
- Wedding

## 🛒 Testing the Shopping Flow

1. **Browse Products**: Go to /products
2. **Filter & Sort**: Try different categories and sort options
3. **View Product**: Click any product card
4. **Add to Cart**: Adjust quantity (respecting min order qty), click "Add to Cart"
5. **View Cart**: See cart badge update in navigation, click Cart
6. **Checkout**: Click "Proceed to Checkout"
   - Fill shipping info
   - Choose payment terms (Net 30 or Net 60)
   - Review and place order
7. **Success**: See confirmation page
8. **View Order**: Go to Account → Orders

## 🎯 B2B Features to Highlight

### Wholesale Pricing Display
- WSP (Wholesale Price): What the retailer pays
- SRP (Suggested Retail Price): Recommended retail price
- Margin % calculated automatically

### Minimum Order Quantities
- Each product has a MOQ (usually 4-8 units)
- Cart enforces MOQ
- Clear messaging throughout

### Net Payment Terms
- Net 30 (payment due in 30 days)
- Net 60 (payment due in 60 days)
- Payment due dates calculated from order date

### Professional Language
- "Wholesale Portal" not "Shop"
- "Place Order" not "Buy Now"
- Business-focused messaging throughout

## 🔧 Customization Tips

### Update Colors
Edit `src/app/globals.css` and change the CSS variables under `:root`

### Add Real Products
Edit `src/lib/mock-data.ts` and modify the `mockProducts` array

### Change Company Info
- Logo: Update `Navigation.tsx` 
- Company name: Update `Navigation.tsx` and `Footer.tsx`
- Contact info: Update `Footer.tsx` and `contact/page.tsx`

### Add Product Images
1. Add images to `/public/products/`
2. Update product `image_url` in mock data
3. Format: `/products/your-image.jpg`

## 🔗 Connecting to Your Backend

Your Deno backend is already set up at `/Users/ethanokamura/Main/luckybeepress/backend/`.

To connect:

1. **API Client**: Update `src/lib/api-client.ts` with your backend URL
2. **Replace Mock Data**: 
   - Update `src/app/products/page.tsx` to fetch from `/api/products`
   - Update `src/app/orders/page.tsx` to fetch from `/api/orders`
   - Update cart to use backend endpoints
3. **Types**: Your TypeScript types already match the backend schema
4. **Actions**: Use the existing validators in `src/actions/`

## 📦 What's Included

### UI Components (`src/components/ui/`)
- **Button**: Primary, secondary, outline, ghost variants
- **Badge**: Status badges with colors
- **Card**: Container component with header/content/footer
- **Input**: Text input, textarea, select with labels and validation
- **Loading**: Spinner and skeleton loaders

### Utilities (`src/lib/`)
- **mock-data.ts**: All sample data and helper functions
- **cart-context.tsx**: Shopping cart state management

### Complete Page Structure
```
/                    → Homepage
/products            → Product catalog
/products/[id]       → Product detail
/cart                → Shopping cart
/checkout            → Multi-step checkout
/checkout/success    → Order confirmation
/account             → Customer dashboard
/account/addresses   → Address management
/orders              → Order history
/orders/[id]         → Order details
/contact             → Contact form
```

## 🐛 Troubleshooting

### Auth0 Issues
- Make sure all Auth0 env variables are set correctly
- Callback URL in Auth0 must include `http://localhost:3000/api/auth/callback`
- Logout URL must include `http://localhost:3000`

### Cart Not Persisting
- Cart uses localStorage
- Check browser console for errors
- Clear localStorage and try again: `localStorage.clear()`

### Styles Not Loading
- Make sure Tailwind is configured correctly
- Check `tailwind.config.ts` and `postcss.config.mjs`
- Restart dev server

## 📝 Next Steps

1. **Set up Auth0** - Configure authentication
2. **Add Product Images** - Replace placeholders with real photos
3. **Test User Flows** - Go through the complete shopping experience
4. **Customize Branding** - Update colors, logo, company info
5. **Connect Backend** - Integrate with your Deno API
6. **Deploy** - Deploy to Vercel or your preferred host

## 💡 Tips

- Mobile-responsive by default - test on different screen sizes
- All forms have validation
- Cart badge updates automatically
- Guest users can browse but must sign in to see prices
- Mock data makes it easy to test without a backend

## 📞 Need Help?

Check the full documentation in `PROJECT_README.md` for detailed information about:
- Architecture and file structure
- Component API documentation
- Data models and types
- Backend integration guide
- Deployment instructions

---

**Happy building!** 🐝✨


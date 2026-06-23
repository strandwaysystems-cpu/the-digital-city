# Project TODO — Digital Products Store

## Infrastructure
- [x] Push database schema with products, orders, downloads tables
- [x] Set up Stripe integration for payment processing
- [x] Upload product PDFs to S3 storage for delivery

## Product Catalog
- [x] Create products table (name, description, price, type, file_key, is_free)
- [x] Create orders table (user_id, product_id, stripe_session_id, status, amount)
- [x] Create downloads table (user_id, product_id, download_count, last_downloaded)
- [x] Seed initial products (Digital City Ebook $39, Portfolio Blueprint $17, Builder's Toolkit FREE, Sovereign Entrepreneur FREE)

## Payment & Checkout
- [x] Stripe checkout session creation endpoint
- [x] Stripe webhook handler for payment confirmation
- [x] Post-purchase order recording and download access granting
- [x] Checkout success page with download links

## Lead Magnet System
- [x] Email capture form with Beehiiv integration (redirect to hosted page)
- [ ] Gated free product delivery after email signup
- [ ] Lead magnet download tracking

## Product Pages
- [ ] Individual product detail pages with full descriptions
- [x] Product listing/store page
- [x] Shopping cart or direct checkout flow

## User Accounts & Downloads
- [x] User dashboard with purchase history
- [x] Secure download links for purchased products
- [x] Download count tracking

## Frontend
- [x] Preserve existing landing page design (Dark Cartographic Minimal)
- [x] Add store/products route
- [x] Add checkout success/failure pages
- [x] Add user account/dashboard page
- [x] Update App.tsx with new routes
- [x] Update navbar with store link
- [x] Wire Buy buttons in Home.tsx to /store (not Gumroad)
- [x] Update download logic to use CDN URLs from fileUrl column

## Testing
- [x] Vitest tests for product CRUD procedures
- [x] Vitest tests for checkout flow (auth required)
- [x] Vitest tests for download access control

## Landing Page Makeover
- [x] Upload new logo to CDN
- [x] New color palette: deep navy base + cyan/magenta neon accents from logo
- [x] Glassmorphism design system (frosted glass cards, glow effects, gradients)
- [x] Rewrite hero section with premium Framer-level animations
- [x] Update Districts to official 5: Intelligent & Autonomous, Attention & Media, E-Commerce & Retail, Financial & Fintech, Software & Enterprise
- [x] Rewrite Book, Resources, and CTA sections with new design
- [x] Update Store page to match new design system
- [x] Update Account page to match new design system
- [x] Remove Klaviyo env vars (not needed)

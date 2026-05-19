# Project TODO — Digital Products Store

## Infrastructure
- [ ] Push database schema with products, orders, downloads tables
- [ ] Set up Stripe integration for payment processing
- [ ] Upload product PDFs to S3 storage for delivery

## Product Catalog
- [ ] Create products table (name, description, price, type, file_key, is_free)
- [ ] Create orders table (user_id, product_id, stripe_session_id, status, amount)
- [ ] Create downloads table (user_id, product_id, download_count, last_downloaded)
- [ ] Seed initial products (Digital City Ebook $39, Portfolio Blueprint $17, Builder's Toolkit FREE, Sovereign Entrepreneur FREE)

## Payment & Checkout
- [ ] Stripe checkout session creation endpoint
- [ ] Stripe webhook handler for payment confirmation
- [ ] Post-purchase order recording and download access granting
- [ ] Checkout success page with download links

## Lead Magnet System
- [ ] Email capture form with Beehiiv integration (server-side API call)
- [ ] Gated free product delivery after email signup
- [ ] Lead magnet download tracking

## Product Pages
- [ ] Individual product detail pages with full descriptions
- [ ] Product listing/store page
- [ ] Shopping cart or direct checkout flow

## User Accounts & Downloads
- [ ] User dashboard with purchase history
- [ ] Secure download links for purchased products
- [ ] Download count tracking

## Frontend
- [ ] Preserve existing landing page design (Dark Cartographic Minimal)
- [ ] Add store/products route
- [ ] Add checkout success/failure pages
- [ ] Add user account/dashboard page
- [ ] Update App.tsx with new routes
- [ ] Update navbar with store link

## Testing
- [ ] Vitest tests for product CRUD procedures
- [ ] Vitest tests for checkout flow
- [ ] Vitest tests for download access control

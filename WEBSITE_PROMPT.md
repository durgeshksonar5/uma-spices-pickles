# Master Website Generation Prompt: Uma Spices & Pickles

> **Purpose**: This file contains the complete, production-ready Master Prompt and technical design specification required to build an exact replica of the **Uma Spices & Pickles (Gajanan Spices)** e-commerce application using **HTML5, Vanilla CSS / Tailwind CSS (CDN), and Vanilla JavaScript (ES6 Modules)**.

---

## 🎨 1. Design System & Theme Tokens

### Color Palette
- **Main Background**: `#FFFBF5` (Warm Cream)
- **Primary Accent**: `#9A6428` (Spice Brown)
- **Primary Hover Accent**: `#80511D` (Dark Spice Brown)
- **Dark Accent**: `#5E3718` (Deep Earth Brown)
- **Light Container BG**: `#FFF7ED` (Soft Off-White)
- **Warm Highlight Cream**: `#F9EFDD` (Subtle highlight fill)
- **Dark Text**: `#171717` (Charcoal)
- **Muted Text**: `#777166` (Warm Muted Gray)
- **Border Light**: `#E8DDCF` (Subtle beige border)
- **WhatsApp Accent**: `#25D366` (Order CTA & Floating button)
- **Star Rating Gold**: `#E9A900` / `#E6A817` (Review stars & badges)

### Typography
- **Headings & Serif Elements**: `'Cormorant Garamond'`, `'Playfair Display'`, Georgia, serif
- **Body & Interface UI**: `'Inter'`, system-ui, sans-serif

### Glassmorphism & UI Utilities
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(232, 221, 207, 0.7);
}

.glass-dark {
  background: rgba(94, 55, 24, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #FFFBF5;
}
::-webkit-scrollbar-thumb {
  background: #9A6428;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5E3718;
}
```

---

## 📁 2. File & Directory Architecture

```text
uma-spices-vanilla/
├── index.html                  # Home page
├── shop.html                   # Shop catalog & filtering page
├── product-details.html        # Product detail view with dynamic weight pricing
├── cart.html                   # Full Shopping Cart page
├── wishlist.html               # Saved Wishlist items page
├── gallery.html                # Filterable photo/video gallery + Lightbox popup
├── about.html                  # Brand story & traditional pounding process
├── contact.html                # Contact page with interactive FAQ accordion & map
├── admin-login.html            # Admin authentication login page
├── admin-dashboard.html        # Client-side Admin CRUD management panel
├── css/
│   └── style.css               # Design system variables, glassmorphism & custom utility classes
├── js/
│   ├── data.js                 # Seed data (Products, Categories, Reviews, Gallery)
│   ├── store.js                # LocalStorage state management (Cart, Wishlist, Admin)
│   ├── app.js                  # Global Header, Navigation, Cart Drawer & Toast System
│   ├── home.js                 # Home page dynamic sections & slider controls
│   ├── shop.js                 # Filtering, sorting, category sidebar logic
│   ├── product-details.js      # Dynamic weight pricing, quantity & gallery viewer
│   ├── gallery.js              # Gallery category filters & Lightbox modal
│   ├── whatsapp.js             # Formatted WhatsApp checkout order generator
│   └── admin.js                # Admin panel CRUD for products, hero, festive deals
└── assets/                     # Product images, banner graphics, logo icons
```

---

## 📦 3. Data Schemas

### Category Schema
```javascript
{
  id: "cat-spices",
  slug: "spices",
  name: "Spices (मसाले)",
  description: "Pure ground powders and authentic whole spices.",
  image: "/assets/categories/cat-spices.png",
  icon: "Sparkles"
}
```

### Product Schema
```javascript
{
  id: "prod-red-chilli",
  slug: "kashmiri-red-chilli-powder",
  name: "Kashmiri Red Chilli Powder",
  marathiName: "काश्मिरी लाल तिखट",
  category: "Spices (मसाले)",
  categorySlug: "spices",
  description: "Rich color with mild pungency, ground from premium sun-dried chillies.",
  shortDescription: "Pure ground spices for rich color and vibrant aroma.",
  images: [
    "/assets/products/chilli-1.jpg",
    "/assets/products/chilli-2.jpg"
  ],
  weights: [
    { weight: "250g", price: 180 },
    { weight: "500g", price: 340 },
    { weight: "1kg", price: 650 }
  ],
  spiceLevel: "Medium",
  ingredients: ["100% Pure Red Chilli"],
  isBestSeller: true,
  inStock: true,
  rating: 4.9,
  reviewsCount: 124
}
```

---

## 🌐 4. Detailed Page Specifications & Requirements

### 1. Global Header & Mobile Navigation
- Announcement bar top strip ("Free Shipping on orders above ₹999 | Call: +91 98765 43210").
- Main Header: Brand Logo, Navigation Links (**Home, Shop, Gallery, About Us, Contact Us**).
- Search input with real-time popup matching products.
- Wishlist Heart icon with dynamic item counter badge.
- Shopping Bag icon triggering the **Slide-Over Cart Drawer** with dynamic counter badge.
- Mobile Hamburger button triggering a full height slide-in navigation drawer.

### 2. Home Page (`index.html`)
- **Hero Banner Section**:
  - Full-width hero banner background image with dark gradient overlay (`bg-gradient-to-r from-black/85 via-black/60 to-black/30`).
  - Animated top badge: `"Gajanan Spices • 100% Pure & Handcrafted"`.
  - Main Headline: `"Discover the Essence of Fresh Spices & Pickles with Gajanan Spices"`.
  - Subtitle: `"Handpicked ingredients, traditional recipes and authentic flavours crafted by Gajanan Spices."`
  - Dual CTAs: **"Shop Spices & Pickles"** (primary brown) and **"Explore Collections"** (glass white button).
  - Trust Badges Bar: 100% Natural • Farm Direct • Traditional Family Recipe.
- **Best Sellers Grid**: 4 top-selling product cards with rating stars, weight dropdowns, dynamic price calculation, and quick "Add to Cart" / "Buy Now" buttons.
- **Shop By Category (11 Categories)**:
  Circular/curved card grid with Marathi titles:
  1. Spices (मसाले)
  2. Pickles (लोणची)
  3. Blends (मसाला मिश्रणे)
  4. Amla Candy (आवळा कँडी)
  5. Juice (ज्यूस)
  6. Murabba (मुरंबा)
  7. Jam (जॅम)
  8. Shevaya & Kurdai (शेवया आणि कुरडई)
  9. Ladoo (लाडू)
  10. Dried Red Chillies (वाळवलेल्या मिरच्या)
  11. Traditional Dried Foods (इतर वाळवणी)
- **Product Catalogue Section**: Tabbed category filters dynamically displaying matching product cards.
- **Promotional Ad Banners**: 2x2 promo cards highlighting festive discounts, organic purity, and combo packs.
- **Customer Testimonials Section**: Rating stars, verified customer quotes, customer photos.
- **WhatsApp Ordering CTA Section**: High-visibility direct link banner connecting directly to WhatsApp (`https://wa.me/91...`).
- **Footer**: Brand summary, Quick Links, Categories, Contact info, Operating Hours, Social icons.

### 3. Shop Page (`shop.html`)
- Search filter input box.
- Filter sidebar: Category checkboxes, Price slider (₹50 to ₹2000), Spice level filter (Mild, Medium, Hot).
- Sort dropdown: Price (Low to High, High to Low), Rating, Best Sellers.
- Product grid with quick dynamic weight switching and instant state update.

### 4. Product Details Page (`product-details.html`)
- URL Query parameter parser (`product-details.html?slug=kashmiri-red-chilli-powder`).
- Product image gallery with main image viewer & interactive thumbnails.
- English & Marathi title display, ratings badge, stock status badge.
- **Interactive Weight Selector**: Radio/chips for `250g`, `500g`, `1kg`. Selecting a weight automatically updates the unit price tag.
- Quantity counter buttons (`-` / `+`).
- **Action Buttons**:
  - `Add to Cart` (stores selected weight + qty in LocalStorage cart).
  - `Buy via WhatsApp` (opens WhatsApp with formatted single item order message).
  - `Wishlist` heart toggle.
- Tabbed Content: **Ingredients**, **Nutritional Info**, **Recipe & Usage Tips**, **Customer Reviews**.
- Related Products Carousel/Grid.

### 5. Cart Page (`cart.html`) & Slide-Over Drawer
- Cart Drawer slides smoothly from right on bag icon click.
- Displays all added items with thumbnail image, title, selected weight, quantity counter controls, item total, and delete button.
- Cart Subtotal calculation, estimated shipping fee (Free above ₹999), Grand Total.
- **WhatsApp Direct Checkout Button**: Formats cart into an ordered WhatsApp message:
  ```text
  *New Order - Uma Spices & Pickles*
  ----------------------------------
  1. Kashmiri Red Chilli Powder (500g) x 2 = ₹680
  2. Mango Pickle (1kg) x 1 = ₹320
  ----------------------------------
  Subtotal: ₹1000
  Shipping: FREE
  Total Amount: ₹1000

  Customer Note: Please process my order.
  ```

### 6. Wishlist Page (`wishlist.html`)
- Displays all saved product cards stored in `localStorage.getItem('wishlist')`.
- Quick "Add to Cart" and "Remove from Wishlist" controls.

### 7. Gallery Page (`gallery.html`)
- Category filter buttons: All, Spices, Pickles, Behind The Scenes, Events.
- Image & Video grid with hover zoom effect.
- Clickable Lightbox Popup Modal for full-screen image viewing.

### 8. About Us Page (`about.html`)
- Brand story, traditional pounding methods (*Kandap Yantra*), farm-direct sourcing, pure spice guarantee, family heritage, and vision.

### 9. Contact Page (`contact.html`)
- Info cards: Phone numbers, Email, Physical Store Address, Working Hours.
- Contact form with validation and submit feedback toast.
- Accordion FAQ component with expand/collapse logic.
- Google Maps responsive iframe embed.

### 10. Admin Management Panel (`admin-dashboard.html` & `admin-login.html`)
- **Admin Login**: Passcode / credentials modal protecting access (`localStorage.setItem('admin_auth', 'true')`).
- **Admin Dashboard Layout**: Sidebar navigation & top stat counters (Total Products, Categories, Reviews, Gallery items).
- **Products Management**: Table of products with search, Add Product modal, Edit Product form, and Delete action.
- **Hero Settings Manager**: Form to update Hero Title, Subtitle, Badge text, Background Image URL, and CTA button text.
- **Festive Deal Manager**: Form to update promo banner text, discount percentage, and banner graphic URL.
- **Gallery Manager**: Add new image links, select category tags, and delete gallery items.
- **Testimonial Manager**: Add/edit/delete customer review quotes.

---

## ⚡ 5. LocalStorage State Engine

```javascript
// State Store Helper (js/store.js)
const STORE_KEYS = {
  CART: 'uma_cart_items',
  WISHLIST: 'uma_wishlist_items',
  PRODUCTS: 'uma_custom_products',
  HERO: 'uma_hero_settings',
  AUTH: 'uma_admin_authenticated'
};

export const Store = {
  getCart: () => JSON.parse(localStorage.getItem(STORE_KEYS.CART) || '[]'),
  setCart: (cart) => {
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  },

  addToCart: (product, selectedWeight, quantity = 1) => {
    const cart = Store.getCart();
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.weight === selectedWeight.weight
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.images[0],
        weight: selectedWeight.weight,
        price: selectedWeight.price,
        quantity
      });
    }
    Store.setCart(cart);
  },

  getWishlist: () => JSON.parse(localStorage.getItem(STORE_KEYS.WISHLIST) || '[]'),
  toggleWishlist: (productId) => {
    let wishlist = Store.getWishlist();
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem(STORE_KEYS.WISHLIST, JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
    return wishlist.includes(productId);
  }
};
```

---

## 💬 6. WhatsApp Direct Checkout Generator

```javascript
// js/whatsapp.js
export function sendCartToWhatsApp(phoneNumber = "919876543210") {
  const cart = JSON.parse(localStorage.getItem('uma_cart_items') || '[]');
  if (cart.length === 0) return alert("Your cart is empty!");

  let message = `*New Order - Uma Spices & Pickles*\n`;
  message += `----------------------------------\n`;

  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `${index + 1}. *${item.name}* (${item.weight}) x ${item.quantity} = ₹${itemTotal}\n`;
  });

  message += `----------------------------------\n`;
  message += `*Total Amount: ₹${total}*\n\n`;
  message += `Please confirm my order and share delivery details.`;

  const encodedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}
```

---

## 🤖 7. Copy-Paste Master Prompt for AI Generators

Copy and paste the prompt box below into any AI model or developer workflow to construct the full website from scratch:

```markdown
Create a complete, fully-functional, responsive e-commerce web application for "Uma Spices & Pickles (Gajanan Spices)" using HTML5, Vanilla CSS / Tailwind CSS (CDN), and Vanilla JavaScript (ES6 Modules).

Build all of the following pages and features:
1. Header with brand logo, nav links (Home, Shop, Gallery, About Us, Contact Us), search bar, wishlist badge count, and slide-over Cart Drawer.
2. Home Page (`index.html`) with Hero banner, 11 circular category cards (Spices, Pickles, Blends, Amla Candy, Juice, Murabba, Jam, Shevaya & Kurdai, Ladoo, Dried Red Chillies, Traditional Dried Foods) with Marathi translations, Best Sellers grid with weight dropdowns (250g, 500g, 1kg), dynamic price updating, product catalogue tabs, 2x2 promo ad banners, testimonials, WhatsApp CTA section, and footer.
3. Shop Page (`shop.html`) with category sidebar filter, search, price slider, and sorting dropdown.
4. Product Details Page (`product-details.html`) with URL query parameter parsing, multi-image gallery, interactive weight radio selector (250g, 500g, 1kg) live updating unit price, quantity controls, Add to Cart, Wishlist, WhatsApp Order button, and ingredient/nutrition tabs.
5. Cart Drawer & Cart Page (`cart.html`) with quantity adjustments, subtotal & shipping calculation, and direct WhatsApp Order integration that generates a formatted WhatsApp text message with cart contents.
6. Wishlist Page (`wishlist.html`) storing saved items in LocalStorage.
7. Gallery Page (`gallery.html`) with category filter tabs and photo/video Lightbox modal preview.
8. About Us Page (`about.html`) detailing traditional spice pounding methods and quality purity promise.
9. Contact Page (`contact.html`) with contact cards, validated contact form, interactive FAQ accordion, and Google Maps iframe embed.
10. Admin Panel (`admin-dashboard.html`) with passcode login, dashboard counters, Product CRUD management (Add/Edit/Delete), Hero Banner settings manager, Festive Deal manager, Testimonial editor, and Gallery item manager.

Enforce the following design tokens:
- Background: #FFFBF5 (Warm Cream)
- Primary Accent: #9A6428 (Spice Brown)
- Hover Accent: #80511D (Dark Spice Brown)
- Dark Accent: #5E3718 (Deep Earth Brown)
- Card BG: #FFF7ED (Soft Off-White)
- Highlight BG: #F9EFDD (Warm Cream)
- Headings Font: 'Cormorant Garamond', serif
- Body Font: 'Inter', sans-serif
- WhatsApp Accent: #25D366

Ensure all data persistence is handled via LocalStorage so that adding products in the Admin panel or editing Hero settings instantly reflects across the user-facing site. Make all pages 100% mobile-responsive with slide-in drawers and toast notifications for user actions.
```

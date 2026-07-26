# Uma Spices & Pickles - Authentic E-Commerce Website

A production-ready e-commerce web application for **Uma Spices & Pickles** built with **React.js**, **Vite**, **Tailwind CSS**, **React Router DOM**, **Context API**, and **WhatsApp Checkout Flow**.

---

## 🌟 Key Features

- **WhatsApp Order Flow**: Generates a pre-filled, URI-encoded WhatsApp order message containing detailed customer information (Name, Phone, Address, City, State, PIN Code) and complete cart item breakdown (Products, Sizes, Quantities, Unit Prices, and Grand Total).
- **Central Configuration**: Change WhatsApp business number, phone, email, address, and social links in one single file (`src/config/businessConfig.js`).
- **Rich Catalogue**: 17+ detailed products across Whole Spices, Ground Spices, Spice Blends, Veg Pickles, Mango Pickles, Chilli Pickles, Lemon Pickles, and Combo Gift Boxes.
- **Dynamic Size Pricing**: Select product weight/size (100g, 250g, 500g, 1kg) with real-time price update.
- **LocalStorage Persistence**: Saves cart items across browser sessions and page reloads.
- **Interactive Shop Page**: Real-time Search, Category filters, Price slider, Stock toggle, Sort dropdown (Price, Rating, Best Sellers), Grid vs List view toggle, and Mobile Filter Drawer.
- **Modern & Premium Indian Food Design**: Rich color palette featuring Deep Maroon (`#7A1F1F`), Spice Orange (`#D95D16`), Mustard Yellow (`#E6A817`), Leaf Green (`#506B2F`), and Warm Cream background (`#FFF8ED`).
- **Responsive Layout**: Fully optimized for 320px mobile up to 4K desktop screens.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

Run the development server locally:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Production Build

Build the project for production deployment:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ⚙️ Customization Guide

### How to Change Business WhatsApp Number & Store Details

All store configuration is central in `src/config/businessConfig.js`:

```javascript
export const businessConfig = {
  brandName: "Uma Spices & Pickles",
  whatsAppNumber: "919876543210", // Change this to your business WhatsApp number with country code
  displayWhatsApp: "+91 98765 43210",
  phoneNumber: "+91 98765 43210",
  email: "orders@umaspices.com",
  address: "Plot No. 42, Spices & Food Park, MIDC Industrial Area, Pune, Maharashtra - 411018, India",
  currencySymbol: "₹",
  freeShippingThreshold: 599,
  // ...
};
```

### How to Add or Modify Products

Product data is stored in `src/data/products.js`. Add or edit products in the array following this structure:

```javascript
{
  id: "prod-my-spice",
  slug: "my-custom-spice",
  name: "My Custom Spice Name",
  category: "ground-spices",
  images: ["https://example.com/image.jpg"],
  price: 150,
  availableSizes: [
    { size: "100g", price: 80 },
    { size: "250g", price: 150 }
  ],
  ingredients: "100% Pure Spices",
  rating: 5.0,
  reviewCount: 24,
  stock: 50,
  featured: true,
  bestSeller: true,
  sku: "UMA-CUSTOM-01",
  shelfLife: "12 Months",
  storageInstructions: "Store in a dry location."
}
```

---

## 📁 Project Structure

```text
src/
├── assets/                  # Static assets & graphics
├── config/
│   └── businessConfig.js    # Business details, WhatsApp number & store settings
├── data/
│   ├── categories.js        # 8 distinct spice & pickle categories
│   └── products.js          # 17+ detailed sample product objects
├── context/
│   ├── CartContext.jsx      # Cart state & LocalStorage sync
│   └── ToastContext.jsx     # Global toast feedback notifications
├── utils/
│   ├── whatsapp.js          # WhatsApp URL message generator & encoder
│   ├── currency.js          # Indian Rupee (₹) currency formatter
│   └── validation.js        # Checkout form validator
├── components/
│   ├── common/              # Breadcrumbs, SectionHeadings, Skeletons, EmptyStates, Toast
│   ├── layout/              # Header, Footer, MobileMenu, WhatsAppFloatingButton
│   ├── products/            # CategoryCard, ProductCard, ProductGrid, ProductFilters
│   ├── cart/                # CartDrawer, CartItem, OrderSummary, WhatsAppCheckoutForm
│   └── home/                # Hero, BestSellers, WhyChooseUs, PromoBanner, BrandStory, Testimonials, Gallery, WhatsAppCTA
├── pages/
│   ├── Home.jsx             # Comprehensive landing page
│   ├── Shop.jsx             # Catalogue listing page with filters & search
│   ├── ProductDetails.jsx   # Product detail page with gallery & specs
│   ├── Cart.jsx             # Standalone shopping cart page
│   ├── About.jsx            # Brand story & heritage
│   ├── Contact.jsx          # Contact details & WhatsApp form
│   └── NotFound.jsx         # 404 page
├── App.jsx                  # Router setup & Context provider wrapper
├── main.jsx                 # Vite React entry point
└── index.css                # Custom Tailwind CSS v4 theme & font declarations
```

---

## 🛡️ License

This project is open-source and customizable for personal or commercial brand deployment.

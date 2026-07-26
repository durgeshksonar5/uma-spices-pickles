export const products = [
  {
    id: "prod-turmeric-powder",
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    descriptor: "Pure & Natural",
    category: "spices",
    subcategory: "Spice Powder",
    shortDescription: "High-curcumin golden turmeric powder ground from sun-dried Salem roots.",
    fullDescription: "Our Turmeric Powder is ground from premium sun-dried whole turmeric fingers with high natural curcumin levels. Processed using cool-milling technology to lock in essential oils and vibrant golden color.",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800"
    ],
    price: 550,
    originalPrice: 650,
    discount: 15,
    availableSizes: [
      { size: "100g", price: 250 },
      { size: "250g", price: 550 },
      { size: "500g", price: 980 }
    ],
    ingredients: "100% Pure Salem Dried Turmeric Roots.",
    rating: 4.9,
    reviewCount: 121,
    stock: 45,
    featured: true,
    bestSeller: true,
    sku: "GAJ-TUR-01",
    shelfLife: "12 Months",
    storageInstructions: "Store in an airtight container in a cool, dry place away from sunlight."
  },
  {
    id: "prod-red-chilli-powder",
    slug: "red-chilli-powder",
    name: "Red Chilli Powder",
    descriptor: "Rich & Spicy",
    category: "spices",
    subcategory: "Spice Powder",
    shortDescription: "Authentic Kashmiri red chilli powder providing rich crimson color with mild warmth.",
    fullDescription: "Handpicked stemless Kashmiri chillies ground to perfection. Enhances curry texture and aroma with deep red hue without harsh burn.",
    images: [
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
    ],
    price: 680,
    originalPrice: 780,
    discount: 13,
    availableSizes: [
      { size: "100g", price: 310 },
      { size: "250g", price: 680 },
      { size: "500g", price: 1250 }
    ],
    ingredients: "Stemless Dried Kashmiri Red Chillies.",
    rating: 4.8,
    reviewCount: 145,
    stock: 60,
    featured: true,
    bestSeller: true,
    sku: "GAJ-RCH-02",
    shelfLife: "12 Months",
    storageInstructions: "Store in a tightly closed jar. Avoid moisture."
  },
  {
    id: "prod-mango-pickle",
    slug: "mango-pickle",
    name: "Mango Pickle",
    descriptor: "Traditional Recipe",
    category: "pickles",
    subcategory: "Handcrafted Pickle",
    shortDescription: "Sun-cured raw mango cubes steeped in cold-pressed mustard oil & spices.",
    fullDescription: "Crisp green raw mangoes cured naturally in ceramic jars with mustard seeds, fenugreek, nigella, and pure mustard oil for authentic grandma-style flavor.",
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1606914501449-5a96b6ce24b6?auto=format&fit=crop&q=80&w=800"
    ],
    price: 750,
    originalPrice: 880,
    discount: 15,
    availableSizes: [
      { size: "250g", price: 390 },
      { size: "500g", price: 750 },
      { size: "1kg", price: 1350 }
    ],
    ingredients: "Raw Mango Cubes, Cold-Pressed Mustard Oil, Yellow Mustard, Fennel, Nigella, Turmeric, Asafoetida, Rock Salt.",
    rating: 4.9,
    reviewCount: 98,
    stock: 80,
    featured: true,
    bestSeller: true,
    sku: "GAJ-MGO-08",
    shelfLife: "18 Months",
    storageInstructions: "Always use a clean dry spoon. Keep oil layer over pickle pieces."
  },
  {
    id: "prod-lemon-pickle",
    slug: "lemon-pickle",
    name: "Lemon Pickle",
    descriptor: "Tangy & Spicy",
    category: "pickles",
    subcategory: "Oil-Free Cured",
    shortDescription: "Sun-aged thin-skinned lemons cured in rock salt, ajwain & digestive spices.",
    fullDescription: "Juicy Kagzi lemons aged in sun jars until soft and tender. Flavored with carom seeds, black salt, and roasted cumin for a digestive punch.",
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"
    ],
    price: 700,
    originalPrice: 820,
    discount: 14,
    availableSizes: [
      { size: "250g", price: 360 },
      { size: "500g", price: 700 },
      { size: "1kg", price: 1280 }
    ],
    ingredients: "Sun-Dried Kagzi Lemons, Rock Salt, Black Salt, Carom Seeds (Ajwain), Cumin, Red Chilli.",
    rating: 4.8,
    reviewCount: 87,
    stock: 50,
    featured: true,
    bestSeller: true,
    sku: "GAJ-LEM-09",
    shelfLife: "24 Months",
    storageInstructions: "Store at room temperature in glass or ceramic jar."
  },
  {
    id: "prod-mixed-pickle",
    slug: "mixed-pickle",
    name: "Mixed Pickle",
    descriptor: "Classic Homemade",
    category: "pickles",
    subcategory: "Mixed Pickle",
    shortDescription: "Crunchy medley of raw mango, carrot, green chilli and lemon in aromatic spices.",
    fullDescription: "A traditional Punjabi-style winter mix pickle featuring crisp vegetables marinated in mustard oil, split mustard seeds, and asafoetida.",
    images: [
      "https://images.unsplash.com/photo-1606914501449-5a96b6ce24b6?auto=format&fit=crop&q=80&w=800"
    ],
    price: 780,
    originalPrice: 900,
    discount: 13,
    availableSizes: [
      { size: "250g", price: 410 },
      { size: "500g", price: 780 },
      { size: "1kg", price: 1420 }
    ],
    ingredients: "Mango, Carrot, Turnip, Green Chilli, Lemon, Mustard Oil, Mustard Seeds, Salt, Spices.",
    rating: 4.9,
    reviewCount: 103,
    stock: 45,
    featured: true,
    bestSeller: true,
    sku: "GAJ-MIX-10",
    shelfLife: "18 Months",
    storageInstructions: "Store in a dry cupboard."
  },
  {
    id: "prod-garam-masala",
    slug: "garam-masala",
    name: "Garam Masala",
    descriptor: "Aromatic Blend",
    category: "blends",
    subcategory: "Traditional Blend",
    shortDescription: "Heritage royal blend of 13 whole roasted aromatic spices.",
    fullDescription: "A classic blend perfected over generations. Contains roasted green cardamom, black cardamom, cloves, cinnamon, mace, and nutmeg to elevate every dish.",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
    ],
    price: 490,
    originalPrice: 580,
    discount: 15,
    availableSizes: [
      { size: "100g", price: 230 },
      { size: "250g", price: 490 },
      { size: "500g", price: 890 }
    ],
    ingredients: "Green Cardamom, Black Cardamom, Cloves, Cinnamon Bark, Mace, Nutmeg, Star Anise, Black Pepper, Cumin, Bay Leaf.",
    rating: 5.0,
    reviewCount: 112,
    stock: 50,
    featured: true,
    bestSeller: true,
    sku: "GAJ-GAR-14",
    shelfLife: "12 Months",
    storageInstructions: "Keep jar air-tight. Add near end of cooking for peak aroma."
  },
  {
    id: "prod-coriander-powder",
    slug: "coriander-powder",
    name: "Coriander Powder (Dhania)",
    descriptor: "Fresh & Aromatic",
    category: "spices",
    subcategory: "Spice Powder",
    shortDescription: "Coarsely ground green coriander seeds with citrusy herbal fragrance.",
    fullDescription: "Milled from high-oil Rajasthan coriander seeds. Imparts body, thick gravy texture, and sweet herbal notes to daily curries.",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
    ],
    price: 420,
    originalPrice: 500,
    discount: 16,
    availableSizes: [
      { size: "100g", price: 190 },
      { size: "250g", price: 420 },
      { size: "500g", price: 780 }
    ],
    ingredients: "100% Whole Roasted Coriander Seeds.",
    rating: 4.7,
    reviewCount: 76,
    stock: 35,
    featured: false,
    bestSeller: false,
    sku: "GAJ-COR-03",
    shelfLife: "12 Months",
    storageInstructions: "Keep container sealed tight."
  },
  {
    id: "prod-cumin-powder",
    slug: "cumin-powder",
    name: "Cumin Powder (Jeera)",
    descriptor: "Slow-Roasted Flame Ground",
    category: "spices",
    subcategory: "Spice Powder",
    shortDescription: "Slow-roasted Unjha cumin seeds ground for digestive warmth and smoky fragrance.",
    fullDescription: "Unjha cumin seeds dry-roasted over slow charcoal flame before grinding. Perfect finishing touch for raita, buttermilk, and dal.",
    images: [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800"
    ],
    price: 460,
    originalPrice: 540,
    discount: 15,
    availableSizes: [
      { size: "100g", price: 210 },
      { size: "250g", price: 460 },
      { size: "500g", price: 840 }
    ],
    ingredients: "100% Roasted Unjha Cumin Seeds.",
    rating: 4.9,
    reviewCount: 94,
    stock: 40,
    featured: false,
    bestSeller: false,
    sku: "GAJ-CUM-04",
    shelfLife: "12 Months",
    storageInstructions: "Keep in a cool dry spice box."
  },
  {
    id: "prod-black-pepper",
    slug: "black-pepper",
    name: "Tellicherry Black Pepper",
    descriptor: "Bold Malabar Peppercorns",
    category: "spices",
    subcategory: "Whole Spice",
    shortDescription: "Extra-large grade Malabar black peppercorns with intense woody heat.",
    fullDescription: "Harvested from Malabar coast of Kerala. Garbled peppercorns left on vine longer to develop complex woody heat.",
    images: [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800"
    ],
    price: 650,
    originalPrice: 750,
    discount: 13,
    availableSizes: [
      { size: "100g", price: 290 },
      { size: "250g", price: 650 },
      { size: "500g", price: 1190 }
    ],
    ingredients: "100% Whole Malabar Black Peppercorns.",
    rating: 4.8,
    reviewCount: 92,
    stock: 40,
    featured: false,
    bestSeller: false,
    sku: "GAJ-BLP-05",
    shelfLife: "24 Months",
    storageInstructions: "Store in pepper mill or glass bottle."
  },
  {
    id: "prod-cumin-seeds",
    slug: "cumin-seeds",
    name: "Cumin Seeds (Whole Jeera)",
    descriptor: "Bold Unjha Seeds",
    category: "spices",
    subcategory: "Whole Spice",
    shortDescription: "Clean, bold-grained whole cumin seeds rich in natural oils.",
    fullDescription: "Directly sourced from Unjha, Gujarat. Sputters with intense aroma when tempered in hot ghee or oil.",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
    ],
    price: 480,
    originalPrice: 560,
    discount: 14,
    availableSizes: [
      { size: "100g", price: 220 },
      { size: "250g", price: 480 },
      { size: "500g", price: 880 }
    ],
    ingredients: "100% Whole Unjha Cumin Seeds.",
    rating: 4.9,
    reviewCount: 88,
    stock: 50,
    featured: false,
    bestSeller: false,
    sku: "GAJ-CMS-06",
    shelfLife: "18 Months",
    storageInstructions: "Store in airtight jar."
  },
  {
    id: "prod-coriander-seeds",
    slug: "coriander-seeds",
    name: "Coriander Seeds (Whole Dhania)",
    descriptor: "Organic Green Seeds",
    category: "spices",
    subcategory: "Whole Spice",
    shortDescription: "Plump green whole coriander seeds with citrus floral fragrance.",
    fullDescription: "Whole coriander seeds perfect for grinding fresh at home or roasting for spice pastes.",
    images: [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800"
    ],
    price: 380,
    originalPrice: 450,
    discount: 15,
    availableSizes: [
      { size: "100g", price: 170 },
      { size: "250g", price: 380 },
      { size: "500g", price: 710 }
    ],
    ingredients: "100% Whole Coriander Seeds.",
    rating: 4.7,
    reviewCount: 62,
    stock: 35,
    featured: false,
    bestSeller: false,
    sku: "GAJ-CRS-07",
    shelfLife: "18 Months",
    storageInstructions: "Keep in dry container."
  },
  {
    id: "prod-green-chilli-pickle",
    slug: "green-chilli-pickle",
    name: "Green Chilli Pickle",
    descriptor: "Stuffed Spicy Delight",
    category: "pickles",
    subcategory: "Spicy Pickle",
    shortDescription: "Fresh green chillies stuffed with tangy crushed yellow mustard & amchur.",
    fullDescription: "Fresh dark green chillies stuffed generously with yellow mustard, fennel, amchur, and cured in mustard oil.",
    images: [
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800"
    ],
    price: 720,
    originalPrice: 840,
    discount: 14,
    availableSizes: [
      { size: "250g", price: 370 },
      { size: "500g", price: 720 },
      { size: "1kg", price: 1320 }
    ],
    ingredients: "Green Chillies, Yellow Mustard, Fennel, Amchur, Mustard Oil, Salt, Hing.",
    rating: 4.9,
    reviewCount: 110,
    stock: 45,
    featured: true,
    bestSeller: false,
    sku: "GAJ-GCP-11",
    shelfLife: "12 Months",
    storageInstructions: "Refrigerate after opening for crunchiness."
  },
  {
    id: "prod-garlic-pickle",
    slug: "garlic-pickle",
    name: "Garlic Pickle (Lahsun Achar)",
    descriptor: "Robust & Fiery",
    category: "pickles",
    subcategory: "Spicy Pickle",
    shortDescription: "Peeled whole garlic cloves marinated in sesame oil and red chilli powder.",
    fullDescription: "Soft whole garlic cloves cured in red chilli, mustard seeds, and sesame oil for intense aromatic bite.",
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"
    ],
    price: 740,
    originalPrice: 860,
    discount: 14,
    availableSizes: [
      { size: "250g", price: 380 },
      { size: "500g", price: 740 },
      { size: "1kg", price: 1360 }
    ],
    ingredients: "Peeled Garlic Cloves, Sesame Oil, Red Chilli Powder, Mustard, Vinegar, Salt.",
    rating: 4.8,
    reviewCount: 95,
    stock: 35,
    featured: false,
    bestSeller: false,
    sku: "GAJ-GAR-12",
    shelfLife: "18 Months",
    storageInstructions: "Store in glass jar."
  },
  {
    id: "prod-sweet-mango-pickle",
    slug: "sweet-mango-pickle",
    name: "Sweet Mango Pickle (Chhundo)",
    descriptor: "Grated Jaggery Delicacy",
    category: "pickles",
    subcategory: "Sweet Pickle",
    shortDescription: "Grated raw mango slow-cooked with organic jaggery, cumin and roasted cloves.",
    fullDescription: "Traditional Gujarati sweet mango pickle prepared with grated raw mangoes and natural jaggery. Perfect pairing for parathas.",
    images: [
      "https://images.unsplash.com/photo-1606914501449-5a96b6ce24b6?auto=format&fit=crop&q=80&w=800"
    ],
    price: 760,
    originalPrice: 890,
    discount: 14,
    availableSizes: [
      { size: "250g", price: 390 },
      { size: "500g", price: 760 },
      { size: "1kg", price: 1390 }
    ],
    ingredients: "Grated Raw Mango, Organic Jaggery, Cumin, Cloves, Red Chilli, Rock Salt.",
    rating: 4.9,
    reviewCount: 88,
    stock: 40,
    featured: false,
    bestSeller: false,
    sku: "GAJ-SMG-13",
    shelfLife: "24 Months",
    storageInstructions: "Keep in a cool dry room."
  },
  {
    id: "prod-kitchen-king-masala",
    slug: "kitchen-king-masala",
    name: "Kitchen King Masala",
    descriptor: "All-in-One Curry Enhancer",
    category: "blends",
    subcategory: "All Purpose Blend",
    shortDescription: "Versatile blend of 20 spices for rich, restaurant-style veg gravies.",
    fullDescription: "A balanced blend of coriander, cumin, turmeric, red chilli, fenugreek leaves, ginger, and garlic powder for delicious sabzis.",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
    ],
    price: 520,
    originalPrice: 620,
    discount: 16,
    availableSizes: [
      { size: "100g", price: 240 },
      { size: "250g", price: 520 },
      { size: "500g", price: 940 }
    ],
    ingredients: "Coriander, Cumin, Red Chilli, Turmeric, Black Pepper, Dry Mango, Kasuri Methi, Ginger, Garlic.",
    rating: 4.8,
    reviewCount: 88,
    stock: 42,
    featured: false,
    bestSeller: false,
    sku: "GAJ-KKM-15",
    shelfLife: "12 Months",
    storageInstructions: "Store away from heat."
  },
  {
    id: "prod-biryani-masala",
    slug: "biryani-masala",
    name: "Biryani Masala",
    descriptor: "Hyderabadi Dum Fragrance",
    category: "blends",
    subcategory: "Specialty Blend",
    shortDescription: "Fragrant saffron & star anise infused masala for authentic biryani aroma.",
    fullDescription: "Whole roasted spices blended with genuine saffron strands, shahi jeera, rose petals, and green cardamom for royal biryani.",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
    ],
    price: 620,
    originalPrice: 720,
    discount: 14,
    availableSizes: [
      { size: "100g", price: 280 },
      { size: "250g", price: 620 },
      { size: "500g", price: 1150 }
    ],
    ingredients: "Shahi Jeera, Star Anise, Green Cardamom, Cinnamon, Cloves, Mace, Saffron Strands, Rose Petals.",
    rating: 4.9,
    reviewCount: 132,
    stock: 38,
    featured: true,
    bestSeller: false,
    sku: "GAJ-BIR-16",
    shelfLife: "12 Months",
    storageInstructions: "Keep tightly sealed to preserve volatile aroma."
  },
  {
    id: "prod-goda-masala",
    slug: "goda-masala",
    name: "Goda Masala",
    descriptor: "Authentic Maharashtrian",
    category: "blends",
    subcategory: "Regional Blend",
    shortDescription: "Roasted coconut and stone flower (dagad phool) infused black masala.",
    fullDescription: "Traditional Maharashtrian aromatic masala roasted with roasted coconut flakes, sesame seeds, and rare regional spices.",
    images: [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800"
    ],
    price: 580,
    originalPrice: 680,
    discount: 14,
    availableSizes: [
      { size: "100g", price: 260 },
      { size: "250g", price: 580 },
      { size: "500g", price: 1050 }
    ],
    ingredients: "Dry Coconut, Sesame Seeds, Coriander, Stone Flower (Dagad Phool), Cassia, Cloves, Black Pepper.",
    rating: 4.9,
    reviewCount: 64,
    stock: 30,
    featured: false,
    bestSeller: false,
    sku: "GAJ-GOD-17",
    shelfLife: "9 Months",
    storageInstructions: "Store in a cool place, prefer refrigeration for long shelf life."
  },
  {
    id: "prod-chefs-signature-bundle",
    slug: "chefs-signature-bundle",
    name: "Chef’s Signature Bundle",
    descriptor: "Best Value Gift Box",
    category: "blends",
    subcategory: "Combo Pack",
    shortDescription: "A curated combo of our 5 best-selling spices and handcrafted pickles.",
    fullDescription: "Includes 250g Salem Turmeric Powder, 250g Kashmiri Red Chilli Powder, 250g Garam Masala, 250g Grandma's Mango Pickle, and 250g Tangy Lemon Pickle in a luxury gift box.",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
    ],
    price: 2150,
    originalPrice: 2650,
    discount: 19,
    availableSizes: [
      { size: "Standard 5-Item Gift Box", price: 2150 }
    ],
    ingredients: "Assorted Spices & Pickles (Turmeric, Red Chilli, Garam Masala, Mango Pickle, Lemon Pickle).",
    rating: 5.0,
    reviewCount: 240,
    stock: 25,
    featured: true,
    bestSeller: true,
    sku: "GAJ-BND-18",
    shelfLife: "12 Months",
    storageInstructions: "Store individual jars as instructed."
  }
];

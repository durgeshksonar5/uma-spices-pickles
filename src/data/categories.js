export const categories = [
  {
    "id": "cat-spices",
    "slug": "spices",
    "name": "Spices (मसाले)",
    "description": "Pure ground powders and authentic whole spices.",
    "image": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-pickles",
    "slug": "pickles",
    "name": "Pickles (लोणची)",
    "description": "Handcrafted, sun-cured traditional pickles.",
    "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    "icon": "Utensils"
  },
  {
    "id": "cat-blends",
    "slug": "blends",
    "name": "Blends (मसाला मिश्रणे)",
    "description": "Aromatic masala blends and chef signature packs.",
    "image": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    "icon": "Flame"
  },
  {
    "id": "cat-amla-candy",
    "slug": "amla-candy",
    "name": "Amla Candy (आवळा कँडी)",
    "description": "A delicious sweet, tangy, and spicy Amla GataGat Candy made from premium Indian gooseberries. Packed with the natural goodness of Vitamin C, it's a fun and refreshing treat for all ages.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-premium-juice",
    "slug": "juice",
    "name": "Juice (ज्यूस)",
    "description": "Refreshing premium-quality juice made from carefully selected ingredients to deliver a naturally delicious taste, rich flavor, and everyday freshness in every sip.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-premium-murabba",
    "slug": "murabba",
    "name": "Murabba (मुरंबा)",
    "description": "Traditional Murabba prepared from premium-quality ingredients using authentic recipes. Sweet, delicious, and packed with rich flavor, making it a perfect treat for every occasion.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-jam",
    "slug": "jam",
    "name": "Jam (जॅम)",
    "description": "Delicious fruit jam made from carefully selected fruits, offering a smooth texture, rich flavor, and the perfect balance of sweetness. A delightful spread for your everyday breakfast and snacks.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-shevaya",
    "slug": "shevaya",
    "name": "Shevaya (शेवया)",
    "description": "Traditional Shevaya made from carefully selected quality ingredients, offering a soft texture and authentic taste. Perfect for preparing delicious sweet and savory dishes for every occasion.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-ladoo",
    "slug": "ladoo",
    "name": "Ladoo (लाडू)",
    "description": "Traditional Indian Ladoos made with carefully selected ingredients, offering a rich taste, soft texture, and authentic homemade flavor. Perfect for festivals, celebrations, and everyday indulgence.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  }
];

export const addCategory = (category) => {
  const slug = category.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');

  const newCat = {
    id: `cat-${slug}`,
    slug,
    name: category.name,
    description: category.description || '',
    image: category.image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    icon: category.icon || "Sparkles"
  };

  categories.push(newCat);

  if (typeof window !== 'undefined') {
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCat)
    }).catch(err => console.error("Error writing category to categories.js:", err));
  }

  return newCat;
};

export const updateCategory = (id, updatedData) => {
  const index = categories.findIndex(c => c.id === id || c.slug === id);
  if (index >= 0) {
    const slug = updatedData.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    categories[index] = {
      ...categories[index],
      ...updatedData,
      slug
    };

    if (typeof window !== 'undefined') {
      fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categories[index])
      }).catch(err => console.error("Error updating category in categories.js:", err));
    }
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex(c => c.id === id || c.slug === id);
  if (index >= 0) {
    const deleted = categories.splice(index, 1)[0];

    if (typeof window !== 'undefined') {
      fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Error deleting category from categories.js:", err));
    }
    return deleted;
  }
  return null;
};

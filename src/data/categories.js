export const categories = [
  {
    "id": "cat-spices",
    "slug": "spices",
    "name": "Spices",
    "description": "Pure ground powders and authentic whole spices.",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "icon": "Sparkles"
  },
  {
    "id": "cat-pickles",
    "slug": "pickles",
    "name": "Pickles",
    "description": "Handcrafted, sun-cured traditional pickles.",
    "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    "icon": "Utensils"
  },
  {
    "id": "cat-blends",
    "slug": "blends",
    "name": "Blends",
    "description": "Aromatic masala blends and chef signature packs.",
    "image": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    "icon": "Flame"
  },
  {
    "id": "cat-chutneys",
    "slug": "chutneys",
    "name": "Chutneys",
    "description": "Chutneys",
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

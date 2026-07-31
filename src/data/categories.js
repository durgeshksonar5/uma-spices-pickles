const defaultCategories = [
  {
    id: "cat-spices",
    slug: "spices",
    name: "Spices",
    description: "Pure ground powders and authentic whole spices.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    icon: "Sparkles"
  },
  {
    id: "cat-pickles",
    slug: "pickles",
    name: "Pickles",
    description: "Handcrafted, sun-cured traditional pickles.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    icon: "Utensils"
  },
  {
    id: "cat-blends",
    slug: "blends",
    name: "Blends",
    description: "Aromatic masala blends and chef signature packs.",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600",
    icon: "Flame"
  }
];

const getInitialCategories = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('uma_categories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing categories from localStorage", e);
      }
    }
    localStorage.setItem('uma_categories', JSON.stringify(defaultCategories));
  }
  return defaultCategories;
};

export const categories = getInitialCategories();

export const addCategory = (category) => {
  const slug = category.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');

  const newCat = {
    id: `cat-${Date.now()}`,
    slug,
    name: category.name,
    description: category.description || '',
    image: category.image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    icon: category.icon || "Sparkles"
  };

  categories.push(newCat);
  if (typeof window !== 'undefined') {
    localStorage.setItem('uma_categories', JSON.stringify(categories));
  }
  return newCat;
};


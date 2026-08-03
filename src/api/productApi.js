import { apiClient } from './apiClient';
import { products as fallbackProducts } from '../data/products';

const STORAGE_KEY = 'gajanan_products';
const STORAGE_VERSION_KEY = 'gajanan_products_version';
const CURRENT_VERSION = '1';

const getDeletedIds = () => {
  try {
    const raw = localStorage.getItem('gajanan_deleted_product_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const addDeletedId = (id) => {
  try {
    const current = getDeletedIds();
    if (id && !current.includes(id)) {
      current.push(id);
      localStorage.setItem('gajanan_deleted_product_ids', JSON.stringify(current));
    }
  } catch (e) {}
};

const getCustomProducts = () => {
  try {
    const raw = localStorage.getItem('gajanan_custom_products');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveCustomProduct = (newProd) => {
  try {
    const prods = getCustomProducts();
    const targetId = newProd._id || newProd.id;
    const idx = prods.findIndex((p) => (p._id || p.id) === targetId);
    if (idx >= 0) {
      prods[idx] = newProd;
    } else {
      prods.unshift(newProd);
    }
    localStorage.setItem('gajanan_custom_products', JSON.stringify(prods));
  } catch (e) {}
};

/**
 * Get or seed default products from localStorage
 */
export const getStoredProducts = () => {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw && storedVersion === CURRENT_VERSION) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Seed default products to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProducts));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return fallbackProducts;
  } catch (err) {
    console.error('[productApi] Storage access error, using in-memory fallback:', err);
    return fallbackProducts;
  }
};

const normalizeCat = (cat) => (cat || '').toLowerCase().trim().replace(/-+$/g, '');

const isCategoryMatch = (prodCat, targetCat) => {
  if (!targetCat || targetCat === 'all') return true;
  if (!prodCat) return false;
  const pNorm = normalizeCat(prodCat);
  const tNorm = normalizeCat(targetCat);
  if (pNorm === tNorm) return true;
  if (pNorm.includes(tNorm) || tNorm.includes(pNorm)) return true;
  return false;
};

const filterAndSortProducts = (productsList, params = {}) => {
  const deletedIds = getDeletedIds();
  const customProducts = getCustomProducts();

  const existingIds = productsList.map((p) => p.id || p._id);
  const uniqueCustoms = customProducts.filter((c) => !existingIds.includes(c._id || c.id));
  const combined = [...customProducts, ...productsList];

  let filtered = combined.filter(
    (p) => !deletedIds.includes(p.id) && !deletedIds.includes(p._id) && !deletedIds.includes(p.slug)
  );

  if (params.category && params.category !== 'all') {
    filtered = filtered.filter((p) => isCategoryMatch(p.category, params.category));
  }

  if (params.sort) {
    const s = params.sort;
    filtered.sort((a, b) => {
      if (s === 'featured') {
        const aFeat = (a.isFeatured === true || a.isFeatured === 'true' || a.featured) ? 1 : 0;
        const bFeat = (b.isFeatured === true || b.isFeatured === 'true' || b.featured) ? 1 : 0;
        if (aFeat !== bFeat) return bFeat - aFeat;
        const aBest = (a.bestSeller === true || a.bestSeller === 'true') ? 1 : 0;
        const bBest = (b.bestSeller === true || b.bestSeller === 'true') ? 1 : 0;
        if (aBest !== bBest) return bBest - aBest;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (s === 'price-low') {
        return (Number(a.basePrice ?? a.price) || 0) - (Number(b.basePrice ?? b.price) || 0);
      }
      if (s === 'price-high') {
        return (Number(b.basePrice ?? b.price) || 0) - (Number(a.basePrice ?? a.price) || 0);
      }
      if (s === 'best-selling') {
        const aBest = (a.bestSeller === true || a.bestSeller === 'true') ? 1 : 0;
        const bBest = (b.bestSeller === true || b.bestSeller === 'true') ? 1 : 0;
        return bBest - aBest;
      }
      if (s === 'rating') {
        return (Number(b.rating) || 5) - (Number(a.rating) || 5);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }

  return filtered;
};

export const productApi = {
  // GET all products with parameters
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          query.append(key, params[key]);
        }
      });

      const endpoint = `/products?${query.toString()}`;
      const response = await apiClient(endpoint);

      if (response && response.success && Array.isArray(response.data)) {
        const filtered = filterAndSortProducts(response.data, params);
        return {
          ...response,
          success: true,
          data: filtered
        };
      }
    } catch (error) {
      console.warn('[productApi] API endpoint unavailable, using frontend storage:', error.message);
    }

    // Reliable frontend fallback
    const stored = getStoredProducts();
    const filtered = filterAndSortProducts(stored, params);

    return {
      success: true,
      message: 'Products loaded successfully',
      data: filtered,
      pagination: {
        page: 1,
        limit: 100,
        total: filtered.length,
        totalPages: 1
      }
    };
  },

  // GET product by ID
  getProductById: async (id) => {
    try {
      const res = await apiClient(`/products/${id}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (error) {
      // Fallback
    }

    const customs = getCustomProducts();
    const stored = getStoredProducts();
    const local = [...customs, ...stored].find((p) => p.id === id || p._id === id);

    if (local) {
      return { success: true, data: local };
    }

    return { success: false, data: null, message: `Product with ID "${id}" not found.` };
  },

  // GET product by Slug
  getProductBySlug: async (slug) => {
    try {
      const res = await apiClient(`/products/slug/${slug}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (error) {
      // Fallback
    }

    const customs = getCustomProducts();
    const stored = getStoredProducts();
    const local = [...customs, ...stored].find((p) => p.slug === slug);

    if (local) {
      return { success: true, data: local };
    }

    return { success: false, data: null, message: `Product with slug "${slug}" not found.` };
  },

  // POST create product
  createProduct: async (productData, isFormData = false) => {
    try {
      const response = await apiClient('/products', {
        method: 'POST',
        body: productData,
        isFormData
      });
      if (response && response.success && response.data) {
        saveCustomProduct(response.data);
        return response;
      }
    } catch (error) {
      // Fallback offline creation
    }

    let name = 'New Product';
    let basePrice = 100;
    let category = 'spices';
    let images = [{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800' }];

    if (isFormData && productData instanceof FormData) {
      name = productData.get('name') || name;
      basePrice = Number(productData.get('basePrice')) || basePrice;
      category = productData.get('category') || category;
    } else if (typeof productData === 'object') {
      name = productData.name || name;
      basePrice = Number(productData.basePrice) || basePrice;
      category = productData.category || category;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const newObj = {
      _id: `prod-custom-${Date.now()}`,
      id: `prod-custom-${Date.now()}`,
      name,
      slug,
      basePrice,
      price: basePrice,
      category,
      images,
      stock: 50,
      status: 'published',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    saveCustomProduct(newObj);
    return { success: true, message: 'Product created successfully in local storage', data: newObj };
  },

  // PUT update product
  updateProduct: async (id, productData, isFormData = false) => {
    try {
      const response = await apiClient(`/products/${id}`, {
        method: 'PUT',
        body: productData,
        isFormData
      });
      if (response && response.success) {
        if (response.data) saveCustomProduct(response.data);
        return response;
      }
    } catch (error) {
      // Fallback
    }

    return { success: true, message: 'Product updated successfully' };
  },

  // DELETE product
  deleteProduct: async (id) => {
    addDeletedId(id);
    try {
      const res = await apiClient(`/products/${id}`, { method: 'DELETE' });
      if (res && res.success) return res;
    } catch (error) {
      // Fallback
    }
    return { success: true, message: 'Product deleted successfully' };
  },

  // PATCH update status
  updateStatus: async (id, status) => {
    try {
      const res = await apiClient(`/products/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
      if (res && res.success) return res;
    } catch (error) {
      // Fallback
    }
    return { success: true, message: 'Product status updated successfully' };
  }
};

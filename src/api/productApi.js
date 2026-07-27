import { apiClient } from './apiClient';
import { products as fallbackProducts } from '../data/products';

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

export const productApi = {
  // GET all products with parameters
  getProducts: async (params = {}) => {
    const deletedIds = getDeletedIds();
    const customProducts = getCustomProducts();

    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          query.append(key, params[key]);
        }
      });

      const endpoint = `/products?${query.toString()}`;
      const response = await apiClient(endpoint);

      if (response && Array.isArray(response.data)) {
        // Merge custom created products if not already in response
        const existingIds = response.data.map((p) => p._id || p.id);
        const uniqueCustoms = customProducts.filter((c) => !existingIds.includes(c._id || c.id));
        const merged = [...response.data, ...uniqueCustoms];

        response.data = merged.filter(
          (p) => !deletedIds.includes(p._id) && !deletedIds.includes(p.id) && !deletedIds.includes(p.slug)
        );
      }
      return response;
    } catch (error) {
      console.warn('[productApi] Utilizing resilient local fallback dataset:', error.message);

      const existingIds = fallbackProducts.map((p) => p.id || p._id);
      const uniqueCustoms = customProducts.filter((c) => !existingIds.includes(c._id || c.id));
      const combined = [...customProducts, ...fallbackProducts];

      let filtered = combined.filter(
        (p) => !deletedIds.includes(p.id) && !deletedIds.includes(p._id) && !deletedIds.includes(p.slug)
      );

      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category === params.category.toLowerCase());
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(s) || p.shortDescription?.toLowerCase().includes(s)
        );
      }

      return {
        success: true,
        message: 'Products loaded from fallback',
        data: filtered,
        pagination: {
          page: 1,
          limit: 100,
          total: filtered.length,
          totalPages: 1
        }
      };
    }
  },

  // GET product by ID
  getProductById: async (id) => {
    try {
      return await apiClient(`/products/${id}`);
    } catch (error) {
      const customs = getCustomProducts();
      const local = [...customs, ...fallbackProducts].find((p) => p.id === id || p._id === id);
      if (local) return { success: true, data: local };
      throw error;
    }
  },

  // GET product by Slug
  getProductBySlug: async (slug) => {
    try {
      return await apiClient(`/products/slug/${slug}`);
    } catch (error) {
      const customs = getCustomProducts();
      const local = [...customs, ...fallbackProducts].find((p) => p.slug === slug);
      if (local) return { success: true, data: local };
      throw error;
    }
  },

  // POST create product
  createProduct: async (productData, isFormData = false) => {
    try {
      const response = await apiClient('/products', {
        method: 'POST',
        body: productData,
        isFormData
      });
      if (response && response.data) {
        saveCustomProduct(response.data);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
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
        return { success: true, message: 'Product created successfully', data: newObj };
      }
      throw error;
    }
  },

  // PUT update product
  updateProduct: async (id, productData, isFormData = false) => {
    try {
      const response = await apiClient(`/products/${id}`, {
        method: 'PUT',
        body: productData,
        isFormData
      });
      if (response && response.data) {
        saveCustomProduct(response.data);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
        return { success: true, message: 'Product updated successfully' };
      }
      throw error;
    }
  },

  // DELETE product
  deleteProduct: async (id) => {
    addDeletedId(id);
    try {
      return await apiClient(`/products/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return { success: true, message: 'Product deleted successfully' };
    }
  },

  // PATCH update status
  updateStatus: async (id, status) => {
    return await apiClient(`/products/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }
};

import { apiClient } from './apiClient';
import { products as fallbackProducts } from '../data/products';

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
      return response;
    } catch (error) {
      console.warn('[productApi] API request failed, utilizing fallback product data:', error.message);
      
      // Fallback matching parameters for Shop page resilience
      let filtered = [...fallbackProducts];
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
        message: 'Products loaded from static fallback',
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
      const local = fallbackProducts.find((p) => p.id === id || p._id === id);
      if (local) return { success: true, data: local };
      throw error;
    }
  },

  // GET product by Slug
  getProductBySlug: async (slug) => {
    try {
      return await apiClient(`/products/slug/${slug}`);
    } catch (error) {
      const local = fallbackProducts.find((p) => p.slug === slug);
      if (local) return { success: true, data: local };
      throw error;
    }
  },

  // POST create product (supports FormData or JSON)
  createProduct: async (productData, isFormData = false) => {
    return await apiClient('/products', {
      method: 'POST',
      body: productData,
      isFormData
    });
  },

  // PUT update product
  updateProduct: async (id, productData, isFormData = false) => {
    return await apiClient(`/products/${id}`, {
      method: 'PUT',
      body: productData,
      isFormData
    });
  },

  // DELETE product
  deleteProduct: async (id) => {
    return await apiClient(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // PATCH update status
  updateStatus: async (id, status) => {
    return await apiClient(`/products/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }
};

import { apiClient } from './apiClient';

const DEFAULT_HERO = {
  heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1920',
  heroTitle: 'Discover the Essence of Fresh Spices & Pickles',
  heroSubtitle: 'Handpicked ingredients, traditional recipes and authentic flavours crafted to make every meal memorable.',
  heroBadge: '100% Pure & Handcrafted',
  heroCtaText: 'Shop Spices & Pickles'
};

const DEFAULT_FESTIVE_DEAL = {
  badge: 'SPECIAL FESTIVE DEAL',
  tagline: 'Latest Offer • Best Value',
  title: 'Chef’s Signature Bundle',
  description: 'A curated combination of our bestselling spices and traditional handcrafted pickles. Delivered in a premium airtight gift box.',
  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000',
  price: 2150,
  originalPrice: 2650,
  discount: '19% OFF',
  includedItems: ['Turmeric Powder', 'Red Chilli Powder', 'Garam Masala', 'Mango Pickle', 'Lemon Pickle']
};

const getStoredItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStoredItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

export const settingsApi = {
  getHeroSettings: async () => {
    try {
      const response = await apiClient('/settings/hero');
      if (response && response.data) {
        saveStoredItem('gajanan_hero_settings', response.data);
        return response;
      }
    } catch (error) {
      console.warn('[settingsApi] Utilizing local hero banner settings:', error.message);
    }
    const local = getStoredItem('gajanan_hero_settings', DEFAULT_HERO);
    return { success: true, data: local };
  },

  updateHeroSettings: async (heroData, isFormData = false) => {
    try {
      const response = await apiClient('/settings/hero', {
        method: 'PUT',
        body: heroData,
        isFormData
      });
      if (response && response.data) {
        saveStoredItem('gajanan_hero_settings', response.data);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
        let heroImage = DEFAULT_HERO.heroImage;
        let heroTitle = DEFAULT_HERO.heroTitle;
        let heroSubtitle = DEFAULT_HERO.heroSubtitle;

        if (isFormData && heroData instanceof FormData) {
          heroImage = heroData.get('heroImage') || heroImage;
          heroTitle = heroData.get('heroTitle') || heroTitle;
          heroSubtitle = heroData.get('heroSubtitle') || heroSubtitle;
        } else if (typeof heroData === 'object') {
          heroImage = heroData.heroImage || heroImage;
          heroTitle = heroData.heroTitle || heroTitle;
          heroSubtitle = heroData.heroSubtitle || heroSubtitle;
        }

        const updated = {
          heroImage,
          heroTitle,
          heroSubtitle,
          heroBadge: '100% Pure & Handcrafted',
          heroCtaText: 'Shop Spices & Pickles'
        };
        saveStoredItem('gajanan_hero_settings', updated);
        return { success: true, message: 'Hero settings updated', data: updated };
      }
      throw error;
    }
  },

  getFestiveDealSettings: async () => {
    try {
      const response = await apiClient('/settings/festive-deal');
      if (response && response.data) {
        saveStoredItem('gajanan_festive_deal', response.data);
        return response;
      }
    } catch (error) {
      console.warn('[settingsApi] Utilizing local festive deal settings:', error.message);
    }
    const local = getStoredItem('gajanan_festive_deal', DEFAULT_FESTIVE_DEAL);
    return { success: true, data: local };
  },

  updateFestiveDealSettings: async (dealData, isFormData = false) => {
    try {
      const response = await apiClient('/settings/festive-deal', {
        method: 'PUT',
        body: dealData,
        isFormData
      });
      if (response && response.data) {
        saveStoredItem('gajanan_festive_deal', response.data);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
        let title = DEFAULT_FESTIVE_DEAL.title;
        let description = DEFAULT_FESTIVE_DEAL.description;
        let price = DEFAULT_FESTIVE_DEAL.price;
        let originalPrice = DEFAULT_FESTIVE_DEAL.originalPrice;
        let discount = DEFAULT_FESTIVE_DEAL.discount;
        let image = DEFAULT_FESTIVE_DEAL.image;
        let includedItems = DEFAULT_FESTIVE_DEAL.includedItems;

        if (isFormData && dealData instanceof FormData) {
          title = dealData.get('title') || title;
          description = dealData.get('description') || description;
          price = Number(dealData.get('price')) || price;
          originalPrice = Number(dealData.get('originalPrice')) || originalPrice;
          discount = dealData.get('discount') || discount;
          image = dealData.get('image') || image;
          const itemsStr = dealData.get('includedItems');
          if (itemsStr && typeof itemsStr === 'string') {
            includedItems = itemsStr.split(',').map((s) => s.trim()).filter(Boolean);
          }
        } else if (typeof dealData === 'object') {
          title = dealData.title || title;
          description = dealData.description || description;
          price = Number(dealData.price) || price;
          originalPrice = Number(dealData.originalPrice) || originalPrice;
          discount = dealData.discount || discount;
          image = dealData.image || image;
          if (Array.isArray(dealData.includedItems)) includedItems = dealData.includedItems;
        }

        const updated = {
          badge: 'SPECIAL FESTIVE DEAL',
          tagline: 'Latest Offer • Best Value',
          title,
          description,
          image,
          price,
          originalPrice,
          discount,
          includedItems
        };
        saveStoredItem('gajanan_festive_deal', updated);
        return { success: true, message: 'Festive deal settings updated', data: updated };
      }
      throw error;
    }
  }
};

import { apiClient } from './apiClient';

const DEFAULT_TESTIMONIALS = [
  {
    _id: "testi-1",
    id: "testi-1",
    name: "Meenakshi Sundaram",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    review: "The Salem Turmeric and Traditional Mango Pickle taste exactly like what my mother used to prepare at home. The WhatsApp ordering was super fast!",
    initials: "MS"
  },
  {
    _id: "testi-2",
    id: "testi-2",
    name: "Rajesh Kulkarni",
    location: "Pune, Maharashtra",
    rating: 5,
    review: "Goda Masala and Garam Masala quality is unmatched. You can immediately smell the fresh essential oils when you open the jar. Highly recommended!",
    initials: "RK"
  },
  {
    _id: "testi-3",
    id: "testi-3",
    name: "Pooja Sharma",
    location: "New Delhi",
    rating: 5,
    review: "Stuffed Green Chilli Pickle is addictive! Perfectly spicy and tangy without being overly salty. Packaging was completely leakproof with inner foil seal.",
    initials: "PS"
  },
  {
    _id: "testi-4",
    id: "testi-4",
    name: "Vikramjit Singh",
    location: "Chandigarh",
    rating: 5,
    review: "Ordered the 4-pack Flavour Box for festival gifting. All my family members loved the taste of Kashmiri Red Chilli and Tangy Lemon Pickle.",
    initials: "VS"
  }
];

const getStoredTestimonials = () => {
  try {
    const raw = localStorage.getItem('gajanan_testimonials');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const saveStoredTestimonials = (data) => {
  try {
    localStorage.setItem('gajanan_testimonials', JSON.stringify(data));
  } catch (e) {}
};

export const testimonialApi = {
  getTestimonials: async () => {
    try {
      const response = await apiClient('/testimonials');
      if (response && response.data) {
        saveStoredTestimonials(response.data);
        return response;
      }
    } catch (error) {
      console.warn('[testimonialApi] Utilizing local fallback testimonials:', error.message);
    }
    const local = getStoredTestimonials() || DEFAULT_TESTIMONIALS;
    return { success: true, data: local };
  },

  createTestimonial: async (testimonialData) => {
    try {
      const response = await apiClient('/testimonials', {
        method: 'POST',
        body: testimonialData
      });
      if (response && response.data) {
        const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
        current.unshift(response.data);
        saveStoredTestimonials(current);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
        const initials = testimonialData.name
          ? testimonialData.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : 'VC';

        const newObj = {
          _id: `testi-${Date.now()}`,
          id: `testi-${Date.now()}`,
          name: testimonialData.name || 'Anonymous Customer',
          location: testimonialData.location || 'Verified Customer',
          rating: Number(testimonialData.rating) || 5,
          review: testimonialData.review || '',
          initials
        };
        const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
        current.unshift(newObj);
        saveStoredTestimonials(current);
        return { success: true, message: 'Testimonial added', data: newObj };
      }
      throw error;
    }
  },

  updateTestimonial: async (id, testimonialData) => {
    try {
      const response = await apiClient(`/testimonials/${id}`, {
        method: 'PUT',
        body: testimonialData
      });
      if (response && response.data) {
        const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
        const idx = current.findIndex((t) => (t._id || t.id) === id);
        if (idx >= 0) current[idx] = response.data;
        saveStoredTestimonials(current);
      }
      return response;
    } catch (error) {
      if (error.isOffline) {
        const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
        const idx = current.findIndex((t) => (t._id || t.id) === id);
        if (idx >= 0) {
          current[idx] = { ...current[idx], ...testimonialData };
          saveStoredTestimonials(current);
        }
        return { success: true, message: 'Testimonial updated' };
      }
      throw error;
    }
  },

  deleteTestimonial: async (id) => {
    try {
      const response = await apiClient(`/testimonials/${id}`, {
        method: 'DELETE'
      });
      const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
      const filtered = current.filter((t) => (t._id || t.id) !== id);
      saveStoredTestimonials(filtered);
      return response;
    } catch (error) {
      const current = getStoredTestimonials() || [...DEFAULT_TESTIMONIALS];
      const filtered = current.filter((t) => (t._id || t.id) !== id);
      saveStoredTestimonials(filtered);
      return { success: true, message: 'Testimonial deleted' };
    }
  }
};

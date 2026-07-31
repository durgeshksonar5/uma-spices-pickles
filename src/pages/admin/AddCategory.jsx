import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addCategory, categories } from '../../data/categories';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Save,
  FolderPlus,
  ImageIcon,
  Sparkles,
  Utensils,
  Flame,
  Leaf,
  Grid,
  Layers,
  FileText
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'Yellow Spices',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Red Pickles',
    url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Masala Blends',
    url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Herbs & Leaves',
    url: 'https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?auto=format&fit=crop&q=80&w=600'
  }
];

const PRESET_ICONS = [
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Utensils', icon: Utensils },
  { name: 'Flame', icon: Flame },
  { name: 'Leaf', icon: Leaf },
  { name: 'Grid', icon: Grid },
  { name: 'Layers', icon: Layers }
];

export const AddCategory = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: PRESET_IMAGES[0].url,
    icon: 'Sparkles',
    customImageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectPresetImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
      customImageUrl: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
      
      const exists = categories.some((c) => c.slug === generatedSlug);
      if (exists) {
        newErrors.name = 'A category with this name or slug already exists';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.customImageUrl.trim() && !formData.customImageUrl.match(/^https?:\/\/.+/)) {
      newErrors.customImageUrl = 'Please enter a valid HTTP or HTTPS image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalImage = formData.customImageUrl.trim() || formData.image;
      
      addCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: finalImage,
        icon: formData.icon
      });

      showToast('Category added successfully!', 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message || 'Failed to add category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans max-w-3xl mx-auto pb-12">
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6428] hover:text-[#5E3718] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718] flex items-center gap-2">
            <FolderPlus className="w-7 h-7 text-[#9A6428]" />
            <span>Add New Category</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Create a custom product category that will appear in dropdowns, filters, and catalog sections.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Chutneys & Sauces"
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
            />
            {errors.name && <p className="text-xs text-red-600 font-bold mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Category Description *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Hand-pounded, sun-cured, traditional dry chutneys and spicy pastes..."
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
            />
            {errors.description && (
              <p className="text-xs text-red-600 font-bold mt-1">{errors.description}</p>
            )}
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Category Icon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = formData.icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon: item.name }))}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#9A6428] bg-[#F9EFDD]/40 text-[#5E3718] font-bold'
                        : 'border-[#E8DDCF] bg-white text-[#777166] hover:bg-[#FFFBF5]'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[10px]">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Selection */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
              Category Image Preset
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((img) => {
                const isSelected = formData.image === img.url && !formData.customImageUrl;
                return (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => handleSelectPresetImage(img.url)}
                    className={`relative rounded-xl overflow-hidden border-2 h-20 transition-all cursor-pointer ${
                      isSelected ? 'border-[#9A6428] ring-2 ring-[#9A6428]/20' : 'border-[#E8DDCF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                      <span className="text-[9px] font-bold text-white leading-tight">{img.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                Or Custom Image URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="customImageUrl"
                  value={formData.customImageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/... (optional)"
                  className="w-full px-3.5 py-2.5 pl-9 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
                <ImageIcon className="w-4 h-4 text-[#777166] absolute left-3.5 top-3" />
              </div>
              {errors.customImageUrl && (
                <p className="text-xs text-red-600 font-bold mt-1">{errors.customImageUrl}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-[#E8DDCF] bg-white text-[#777166] hover:bg-[#FFFBF5] text-xs font-bold transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#9A6428] text-white hover:bg-[#80511D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;

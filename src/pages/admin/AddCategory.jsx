import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addCategory, updateCategory, deleteCategory, categories } from '../../data/categories';
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
  Trash2,
  Edit2,
  Upload,
  X
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
  const [editId, setEditId] = useState(null);
  const [categoriesList, setCategoriesList] = useState([...categories]);

  const [uploadedImagePreview, setUploadedImagePreview] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

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
    setUploadedImagePreview('');
    setUploadedFileName('');
    setFormData((prev) => ({
      ...prev,
      image: url,
      customImageUrl: ''
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      showToast('Please select a valid JPG, PNG, or WebP image file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size should be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setUploadedImagePreview(base64);
      setUploadedFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        image: base64,
        customImageUrl: ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImagePreview('');
    setUploadedFileName('');
    setFormData((prev) => ({
      ...prev,
      image: PRESET_IMAGES[0].url
    }));
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    const isBase64 = cat.image?.startsWith('data:image/');
    const isUnsplash = cat.image?.startsWith('https://images.unsplash.com');
    setUploadedImagePreview(isBase64 ? cat.image : '');
    setUploadedFileName(isBase64 ? 'Uploaded Image' : '');
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      icon: cat.icon || 'Sparkles',
      customImageUrl: (!isUnsplash && !isBase64) ? cat.image : ''
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setUploadedImagePreview('');
    setUploadedFileName('');
    setFormData({
      name: '',
      description: '',
      image: PRESET_IMAGES[0].url,
      icon: 'Sparkles',
      customImageUrl: ''
    });
    setErrors({});
  };

  const handleDelete = (id, name) => {
    const defaults = ['cat-spices', 'cat-pickles', 'cat-blends'];
    if (defaults.includes(id)) {
      showToast('Core system categories cannot be deleted.', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        deleteCategory(id);
        showToast('Category deleted successfully!', 'success');
        setCategoriesList([...categories]);
        if (editId === id) {
          handleCancelEdit();
        }
      } catch (err) {
        showToast(err.message || 'Failed to delete category', 'error');
      }
    }
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
      
      const exists = categories.some((c) => c.slug === generatedSlug && c.id !== editId);
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
      
      if (editId) {
        updateCategory(editId, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: finalImage,
          icon: formData.icon
        });
        showToast('Category updated successfully!', 'success');
        setEditId(null);
      } else {
        addCategory({
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: finalImage,
          icon: formData.icon
        });
        showToast('Category added successfully!', 'success');
      }

      setUploadedImagePreview('');
      setUploadedFileName('');
      setFormData({
        name: '',
        description: '',
        image: PRESET_IMAGES[0].url,
        icon: 'Sparkles',
        customImageUrl: ''
      });
      setCategoriesList([...categories]);
    } catch (err) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans max-w-6xl mx-auto pb-12">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718] flex items-center gap-2">
              <FolderPlus className="w-7 h-7 text-[#9A6428]" />
              <span>{editId ? 'Edit Category' : 'Add New Category'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
              {editId 
                ? 'Modify the details of this category in the catalog.'
                : 'Create a custom product category that will appear in dropdowns, filters, and catalog sections.'
              }
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
                  const isSelected = formData.image === img.url && !formData.customImageUrl && !uploadedImagePreview;
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

              {/* Upload Category Image File Field */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Or Upload Category Image
                </label>
                <div className="border-2 border-dashed border-[#9A6428]/40 rounded-xl p-3 bg-[#FFFBF5] text-center hover:bg-[#F9EFDD]/30 transition-colors relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-[#9A6428]" />
                    <span className="text-xs font-bold text-[#5E3718]">
                      {uploadedFileName ? uploadedFileName : 'Click or Drag to Upload Image File'}
                    </span>
                  </div>
                </div>
                {uploadedImagePreview && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E8DDCF] mt-2">
                    <img src={uploadedImagePreview} alt="Uploaded preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveUploadedImage}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow-xs cursor-pointer z-20 hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
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
              {editId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DDCF] bg-white text-[#777166] hover:bg-[#FFFBF5] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel Edit
                </button>
              ) : (
                <Link
                  to="/admin/products"
                  className="px-5 py-2.5 rounded-xl border border-[#E8DDCF] bg-white text-[#777166] hover:bg-[#FFFBF5] text-xs font-bold transition-all text-center"
                >
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#9A6428] text-white hover:bg-[#80511D] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : editId ? 'Update Category' : 'Add Category'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Existing Categories List Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5E3718]">
              Existing Categories
            </h2>
            <p className="text-xs text-[#777166] mt-0.5">
              View, edit or delete product categories.
            </p>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {categoriesList.map((cat) => {
              const presetIcon = PRESET_ICONS.find((i) => i.name === cat.icon);
              const IconComp = presetIcon ? presetIcon.icon : Grid;
              const isDefault = ['cat-spices', 'cat-pickles', 'cat-blends'].includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    editId === cat.id
                      ? 'border-[#9A6428] bg-[#F9EFDD]/20 shadow-xs'
                      : 'border-[#E8DDCF] bg-[#FFFBF5] hover:bg-[#F9EFDD]/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E8DDCF] bg-white shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <IconComp className="w-3.5 h-3.5 text-[#9A6428] shrink-0" />
                        <h3 className="font-sans font-bold text-xs sm:text-sm text-[#171717] truncate capitalize">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-[10px] text-[#777166] line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-lg bg-white border border-[#E8DDCF] text-[#9A6428] hover:bg-[#F9EFDD]/50 transition-all cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-white border border-[#E8DDCF] text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  Package,
  Layers,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'spices',
    brand: 'Gajanan Pure & Homemade Services',
    shortDescription: '',
    description: '',
    basePrice: '',
    salePrice: '',
    stock: 50,
    status: 'published',
    isFeatured: false,
    isActive: true,
    bestSeller: false,
    descriptor: 'Pure & Authentic',
    subcategory: '',
    ingredients: '',
    shelfLife: '12 Months',
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.'
  });

  // Size Variants State
  const [sizes, setSizes] = useState([
    { label: '250g', price: '', stock: 20 }
  ]);

  // Weight Variants State
  const [weights, setWeights] = useState([]);

  // Images State
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fetch product data if edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        setIsLoading(true);
        try {
          const res = await productApi.getProductById(id);
          if (res.success && res.data) {
            const p = res.data;
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              sku: p.sku || '',
              category: p.category || 'spices',
              brand: p.brand || 'Gajanan Pure & Homemade Services',
              shortDescription: p.shortDescription || '',
              description: p.description || p.fullDescription || '',
              basePrice: p.basePrice ?? p.price ?? '',
              salePrice: p.salePrice ?? '',
              stock: p.stock ?? 50,
              status: p.status || 'published',
              isFeatured: p.isFeatured ?? false,
              isActive: p.isActive ?? true,
              bestSeller: p.bestSeller ?? false,
              descriptor: p.descriptor || '',
              subcategory: p.subcategory || '',
              ingredients: p.ingredients || '',
              shelfLife: p.shelfLife || '12 Months',
              storageInstructions: p.storageInstructions || 'Store in a cool, dry place.'
            });

            if (p.sizes && p.sizes.length > 0) {
              setSizes(p.sizes);
            } else if (p.availableSizes && p.availableSizes.length > 0) {
              setSizes(p.availableSizes.map((s) => ({ label: s.size, price: s.price, stock: 20 })));
            }

            if (p.weights && p.weights.length > 0) {
              setWeights(p.weights);
            }

            if (p.images && p.images.length > 0) {
              setExistingImages(p.images);
            }
          }
        } catch (err) {
          showToast(err.message || 'Failed to fetch product details', 'error');
          navigate('/admin/products');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductData();
    }
  }, [id, isEditMode]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name if adding
    if (name === 'name' && !isEditMode) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  // Add / Remove Sizes
  const handleAddSize = () => {
    setSizes((prev) => [...prev, { label: '', price: '', stock: 20 }]);
  };

  const handleRemoveSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    setSizes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Add / Remove Weights
  const handleAddWeight = () => {
    setWeights((prev) => [...prev, { label: '', value: '', unit: 'g', price: '', stock: 20 }]);
  };

  const handleRemoveWeight = (index) => {
    setWeights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWeightChange = (index, field, value) => {
    setWeights((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'value' || field === 'unit') {
            updated.label = `${updated.value} ${updated.unit}`;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Handle File Upload Select
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        showToast(`File ${file.name} is not a valid JPG, PNG or WebP image!`, 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds 5MB size limit!`, 'error');
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [...prev, ...validPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setExistingImages((prev) => [
      ...prev,
      {
        url: imageUrlInput.trim(),
        filename: '',
        altText: formData.name,
        isPrimary: prev.length === 0
      }
    ]);
    setImageUrlInput('');
  };

  const handleSetPrimaryImage = (index, isExisting = true) => {
    if (isExisting) {
      setExistingImages((prev) =>
        prev.map((img, i) => ({ ...img, isPrimary: i === index }))
      );
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.basePrice || Number(formData.basePrice) < 0) {
      newErrors.basePrice = 'Base price must be a valid non-negative number';
    }
    if (formData.salePrice && Number(formData.salePrice) < 0) {
      newErrors.salePrice = 'Sale price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        dataPayload.append(key, formData[key]);
      });

      // Filter and append sizes
      const validSizes = sizes.filter((s) => s.label && s.price !== '');
      dataPayload.append('sizes', JSON.stringify(validSizes));

      // Filter and append weights
      const validWeights = weights.filter((w) => w.price !== '');
      dataPayload.append('weights', JSON.stringify(validWeights));

      // Append existing images JSON
      dataPayload.append('images', JSON.stringify(existingImages));

      // Append newly selected image files
      newImageFiles.forEach((file) => {
        dataPayload.append('imageFiles', file);
      });

      let res;
      if (isEditMode) {
        res = await productApi.updateProduct(id, dataPayload, true);
      } else {
        res = await productApi.createProduct(dataPayload, true);
      }

      if (res.success) {
        showToast(
          isEditMode ? 'Product updated successfully!' : 'Product added successfully!',
          'success'
        );
        navigate('/admin/products');
      }
    } catch (err) {
      showToast(err.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-[#5E3718] font-serif">Loading Product Form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Fill in the details below to publish or update products in the Shop catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <Package className="w-5 h-5 text-[#9A6428]" />
              <span>1. Basic Product Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Salem Turmeric Powder"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
                {errors.name && <p className="text-xs text-red-600 font-bold">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="turmeric-powder"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428] capitalize cursor-pointer"
                >
                  <option value="spices">Spices</option>
                  <option value="pickles">Pickles</option>
                  <option value="blends">Blends</option>
                </select>
              </div>

              {/* SKU */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  SKU Code
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="GAJ-TUR-01"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>
            </div>

            {/* Short & Full Descriptions */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="High-curcumin golden turmeric powder ground from Salem roots."
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Full Product Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of taste, preparation, sourcing and aroma..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing, Inventory & Status */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <DollarSign className="w-5 h-5 text-[#9A6428]" />
              <span>2. Pricing, Inventory & Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Base Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  name="basePrice"
                  required
                  min="0"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="550"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
                {errors.basePrice && <p className="text-xs text-red-600 font-bold">{errors.basePrice}</p>}
              </div>

              {/* Sale Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Sale Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="salePrice"
                  min="0"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="490"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  General Stock Units
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>
            </div>

            {/* Status & Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Product Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428] cursor-pointer"
                >
                  <option value="published">Published (Visible in Shop)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#9A6428] rounded border-[#E8DDCF] focus:ring-[#9A6428]"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-[#171717] cursor-pointer">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="bestSeller"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#9A6428] rounded border-[#E8DDCF] focus:ring-[#9A6428]"
                />
                <label htmlFor="bestSeller" className="text-xs font-bold text-[#171717] cursor-pointer">
                  Best Seller Tag
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Size & Weight Variants */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <Layers className="w-5 h-5 text-[#9A6428]" />
              <span>3. Product Size & Weight Variants (Optional)</span>
            </h3>

            {/* Size Variants Table */}
            <div className="space-y-3 bg-[#F9EFDD]/40 p-4 rounded-2xl border border-[#E8DDCF]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#5E3718] uppercase tracking-wider block">
                  Size Options (e.g., 100g, 250g, 500g, 1kg)
                </label>
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-3 py-1.5 rounded-lg bg-[#9A6428] text-white text-xs font-bold hover:bg-[#80511D] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Size Row</span>
                </button>
              </div>

              {sizes.length === 0 ? (
                <p className="text-xs text-[#777166] italic">No size variants added. Uses base price.</p>
              ) : (
                <div className="space-y-2">
                  {sizes.map((s, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Size (e.g. 250g)"
                        value={s.label}
                        onChange={(e) => handleSizeChange(index, 'label', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={s.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={s.stock}
                        onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                        className="w-1/4 px-3 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weight Variants Table */}
            <div className="space-y-3 bg-[#F9EFDD]/40 p-4 rounded-2xl border border-[#E8DDCF]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#5E3718] uppercase tracking-wider block">
                  Weight Options (Specific Numeric Values & Units)
                </label>
                <button
                  type="button"
                  onClick={handleAddWeight}
                  className="px-3 py-1.5 rounded-lg bg-[#9A6428] text-white text-xs font-bold hover:bg-[#80511D] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Weight Row</span>
                </button>
              </div>

              {weights.length === 0 ? (
                <p className="text-xs text-[#777166] italic">No weight options added.</p>
              ) : (
                <div className="space-y-2">
                  {weights.map((w, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Value (e.g. 500)"
                        value={w.value}
                        onChange={(e) => handleWeightChange(index, 'value', e.target.value)}
                        className="w-1/4 px-3 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      />
                      <select
                        value={w.unit}
                        onChange={(e) => handleWeightChange(index, 'unit', e.target.value)}
                        className="w-1/5 px-2 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={w.price}
                        onChange={(e) => handleWeightChange(index, 'price', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWeight(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Product Image Uploads */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <ImageIcon className="w-5 h-5 text-[#9A6428]" />
              <span>4. Product Images</span>
            </h3>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#9A6428]/40 rounded-2xl p-6 bg-[#F9EFDD]/30 text-center hover:bg-[#F9EFDD]/60 transition-colors">
              <Upload className="w-8 h-8 text-[#9A6428] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#171717]">
                Click or drag images to upload (JPG, PNG, WebP up to 5MB)
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="mt-3 text-xs text-[#777166] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9A6428] file:text-white hover:file:bg-[#80511D] cursor-pointer"
              />
            </div>

            {/* External URL Input Option */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-grow px-3.5 py-2 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl bg-[#9A6428] text-white text-xs font-bold hover:bg-[#80511D] cursor-pointer"
              >
                Add Image URL
              </button>
            </div>

            {/* Image Previews Container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div
                  key={`existing-${idx}`}
                  className={`relative rounded-xl overflow-hidden border-2 bg-white shadow-2xs h-32 ${
                    img.isPrimary ? 'border-[#9A6428] ring-2 ring-[#9A6428]/30' : 'border-[#E8DDCF]'
                  }`}
                >
                  <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx, true)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        img.isPrimary ? 'bg-[#9A6428] text-white' : 'bg-black/60 text-white'
                      }`}
                    >
                      {img.isPrimary ? 'Primary' : 'Set Primary'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Newly Selected Upload Previews */}
              {newImagePreviews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative rounded-xl overflow-hidden border-2 border-[#25D366] bg-white shadow-2xs h-32"
                >
                  <img src={src} alt="New preview" className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#25D366] text-white">
                    New Upload
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-6 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-xl bg-[#F9EFDD] text-[#5E3718] font-bold text-sm hover:bg-[#E8DDCF] transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#9A6428] hover:bg-[#80511D] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Product' : 'Save & Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settingsApi';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/currency';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Eye,
  Check,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';

const DEFAULT_DEAL_IMAGE = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000';

export const AdminFestiveDealSettings = () => {
  const [dealSettings, setDealSettings] = useState({
    badge: 'SPECIAL FESTIVE DEAL',
    tagline: 'Latest Offer • Best Value',
    title: 'Chef’s Signature Bundle',
    description: 'A curated combination of our bestselling spices and traditional handcrafted pickles. Delivered in a premium airtight gift box.',
    image: DEFAULT_DEAL_IMAGE,
    price: 2150,
    originalPrice: 2650,
    discount: '19% OFF',
    includedItems: ['Turmeric Powder', 'Red Chilli Powder', 'Garam Masala', 'Mango Pickle', 'Lemon Pickle']
  });

  const [itemsInput, setItemsInput] = useState('Turmeric Powder, Red Chilli Powder, Garam Masala, Mango Pickle, Lemon Pickle');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_DEAL_IMAGE);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchDealSettings = async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getFestiveDealSettings();
      if (res?.success && res.data) {
        const data = res.data;
        setDealSettings(data);
        setImagePreview(data.image || DEFAULT_DEAL_IMAGE);
        if (Array.isArray(data.includedItems)) {
          setItemsInput(data.includedItems.join(', '));
        }
      }
    } catch (err) {
      showToast('Failed to load festive deal settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDealSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDealSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemsInputChange = (e) => {
    const val = e.target.value;
    setItemsInput(val);
    const parsed = val.split(',').map((s) => s.trim()).filter(Boolean);
    setDealSettings((prev) => ({ ...prev, includedItems: parsed }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      showToast('Please select a valid JPG, PNG, or WebP image file!', 'error');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      setImagePreview(base64);
      setDealSettings((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImagePreview(imageUrlInput.trim());
    setDealSettings((prev) => ({ ...prev, image: imageUrlInput.trim() }));
    setImageUrlInput('');
    showToast('Image URL applied to preview!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('badge', dealSettings.badge);
      payload.append('tagline', dealSettings.tagline);
      payload.append('title', dealSettings.title);
      payload.append('description', dealSettings.description);
      payload.append('price', dealSettings.price);
      payload.append('originalPrice', dealSettings.originalPrice);
      payload.append('discount', dealSettings.discount);
      payload.append('image', dealSettings.image);
      payload.append('includedItems', itemsInput);

      if (imageFile) {
        payload.append('dealImageFile', imageFile);
      }

      const res = await settingsApi.updateFestiveDealSettings(payload, true);
      if (res.success) {
        showToast('Homepage "Special Festive Deal" section updated successfully!', 'success');
        if (res.data && res.data.image) {
          setImagePreview(res.data.image);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to update deal settings', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-[#5E3718] font-serif">Loading Special Festive Deal Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            Homepage "Special Festive Deal" Management
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Edit the Festive Bundle deal image, title, offer pricing, included items, and discounts displayed on the homepage.
          </p>
        </div>

        <button
          onClick={fetchDealSettings}
          className="px-3.5 py-2 rounded-xl bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Original</span>
        </button>
      </div>

      {/* Live Preview Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#9A6428]" />
            <h3 className="font-serif font-bold text-lg text-[#5E3718]">
              Live Homepage "Special Festive Deal" Section Preview
            </h3>
          </div>
        </div>

        {/* Live Deal Card Mockup */}
        <div className="bg-[#F9EFDD]/60 rounded-3xl border border-[#E8DDCF] p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-6 shadow-sm relative overflow-hidden text-left">
          {/* Image */}
          <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden bg-white border border-[#E8DDCF] h-56 sm:h-64 shadow-xs">
            <img
              src={imagePreview}
              alt="Festive Bundle Preview"
              onError={() => setImagePreview(DEFAULT_DEAL_IMAGE)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#9A6428] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{dealSettings.tagline}</span>
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-[#9A6428] tracking-widest uppercase mb-0.5 block">
                {dealSettings.badge}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5E3718] mb-1">
                {dealSettings.title}
              </h3>
              <p className="text-xs text-[#777166] leading-relaxed">
                {dealSettings.description}
              </p>
            </div>

            {/* Included items */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {dealSettings.includedItems?.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E8DDCF] text-[#5E3718] font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Prices */}
            <div className="flex items-center gap-2.5 pt-1">
              <span className="font-serif font-bold text-2xl text-[#171717]">
                {formatCurrency(dealSettings.price)}
              </span>
              {dealSettings.originalPrice && (
                <span className="text-sm text-[#777166] line-through">
                  {formatCurrency(dealSettings.originalPrice)}
                </span>
              )}
              {dealSettings.discount && (
                <span className="text-[10px] font-bold text-[#9A6428] bg-[#9A6428]/15 px-2.5 py-0.5 rounded-full">
                  {dealSettings.discount}
                </span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#25D366] text-white flex items-center gap-1.5 cursor-pointer shadow-xs pointer-events-none"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Order Bundle on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Image Upload */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <ImageIcon className="w-5 h-5 text-[#9A6428]" />
              <span>1. Festive Bundle Image</span>
            </h3>

            <div className="border-2 border-dashed border-[#9A6428]/40 rounded-2xl p-6 bg-[#F9EFDD]/30 text-center hover:bg-[#F9EFDD]/60 transition-colors">
              <Upload className="w-8 h-8 text-[#9A6428] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#171717]">
                Click to select a deal product image (JPG, PNG, WebP)
              </p>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="mt-3 text-xs text-[#777166] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9A6428] file:text-white hover:file:bg-[#80511D] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-grow px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2.5 rounded-xl bg-[#9A6428] text-white text-xs font-bold hover:bg-[#80511D] cursor-pointer shrink-0"
              >
                Apply Image URL
              </button>
            </div>
          </div>

          {/* Section 2: Titles, Pricing & Discount */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <Tag className="w-5 h-5 text-[#9A6428]" />
              <span>2. Deal Details, Pricing & Discount</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Small Upper Badge (e.g. SPECIAL FESTIVE DEAL)
                </label>
                <input
                  type="text"
                  name="badge"
                  value={dealSettings.badge}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Image Corner Tagline (e.g. Latest Offer • Best Value)
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={dealSettings.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Deal Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={dealSettings.title}
                  onChange={handleChange}
                  placeholder="Chef’s Signature Bundle"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm font-serif font-bold"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Deal Description Paragraph
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={dealSettings.description}
                  onChange={handleChange}
                  placeholder="A curated combination of our bestselling spices..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm"
                />
              </div>

              {/* Offer Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Offer Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={dealSettings.price}
                  onChange={handleChange}
                  placeholder="2150"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm font-bold"
                />
              </div>

              {/* Original Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Original Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  min="0"
                  value={dealSettings.originalPrice}
                  onChange={handleChange}
                  placeholder="2650"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm"
                />
              </div>

              {/* Discount Tag */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Discount Badge Label (e.g. 19% OFF)
                </label>
                <input
                  type="text"
                  name="discount"
                  value={dealSettings.discount}
                  onChange={handleChange}
                  placeholder="19% OFF"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Included Items Pills */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <Layers className="w-5 h-5 text-[#9A6428]" />
              <span>3. Included Bundle Products (Comma Separated)</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                Included Items List (Separate each item with a comma)
              </label>
              <textarea
                rows="2"
                value={itemsInput}
                onChange={handleItemsInputChange}
                placeholder="Turmeric Powder, Red Chilli Powder, Garam Masala, Mango Pickle, Lemon Pickle"
                className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm font-mono text-xs"
              />
              <p className="text-[11px] text-[#777166]">
                Each comma-separated item will be displayed as a pill badge in the deal card.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#9A6428] hover:bg-[#80511D] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving Deal...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Publish Festive Deal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFestiveDealSettings;

import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settingsApi';
import { useToast } from '../../context/ToastContext';
import {
  Image as ImageIcon,
  Upload,
  Save,
  RefreshCw,
  Sparkles,
  Type,
  Layout,
  Check,
  Eye
} from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1920';

export const AdminHeroSettings = () => {
  const [heroSettings, setHeroSettings] = useState({
    heroImage: DEFAULT_HERO_IMAGE,
    heroTitle: 'Discover the Essence of Fresh Spices & Pickles',
    heroSubtitle: 'Handpicked ingredients, traditional recipes and authentic flavours crafted to make every meal memorable.',
    heroBadge: '100% Pure & Handcrafted',
    heroCtaText: 'Shop Spices & Pickles'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_HERO_IMAGE);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchHeroSettings = async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getHeroSettings();
      if (res.success && res.data) {
        setHeroSettings(res.data);
        setImagePreview(res.data.heroImage || DEFAULT_HERO_IMAGE);
      }
    } catch (err) {
      showToast('Failed to load hero banner settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      showToast('Please select a valid JPG, PNG, or WebP image file!', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size exceeds 10MB limit!', 'error');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      setImagePreview(base64);
      setHeroSettings((prev) => ({ ...prev, heroImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImagePreview(imageUrlInput.trim());
    setHeroSettings((prev) => ({ ...prev, heroImage: imageUrlInput.trim() }));
    setImageUrlInput('');
    showToast('Image URL applied to preview!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('heroTitle', heroSettings.heroTitle);
      payload.append('heroSubtitle', heroSettings.heroSubtitle);
      payload.append('heroBadge', heroSettings.heroBadge);
      payload.append('heroCtaText', heroSettings.heroCtaText);
      payload.append('heroImage', heroSettings.heroImage);

      if (imageFile) {
        payload.append('heroImageFile', imageFile);
      }

      const res = await settingsApi.updateHeroSettings(payload, true);
      if (res.success) {
        showToast('Homepage Hero Banner Image & text updated successfully!', 'success');
        if (res.data && res.data.heroImage) {
          setImagePreview(res.data.heroImage);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to update hero settings', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-[#5E3718] font-serif">Loading Hero Banner Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            Homepage Hero Banner Management
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Change the full-screen Hero Banner image, headline title, and subtitle displayed on the homepage.
          </p>
        </div>

        <button
          onClick={fetchHeroSettings}
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
              Live Homepage Banner Preview
            </h3>
          </div>
          <span className="text-xs font-bold text-[#25D366] bg-green-100 px-3 py-1 rounded-full">
            Full Screen Width
          </span>
        </div>

        {/* Live Banner Mockup */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#5E3718] border border-[#E8DDCF] shadow-md">
          <img
            src={imagePreview}
            alt="Hero Banner Preview"
            onError={() => setImagePreview(DEFAULT_HERO_IMAGE)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

          {/* Overlay Mockup Text */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center text-left text-white max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6A817]/90 text-[#171717] text-[10px] font-extrabold uppercase w-max">
              <Sparkles className="w-3 h-3" />
              <span>{heroSettings.heroBadge}</span>
            </span>

            <h2 className="font-serif font-extrabold text-xl sm:text-3xl text-[#FFFBF5] line-clamp-2">
              {heroSettings.heroTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#F9EFDD]/90 line-clamp-2">
              {heroSettings.heroSubtitle}
            </p>

            <div className="pt-1">
              <span className="inline-block px-4 py-2 rounded-lg bg-[#9A6428] text-white font-bold text-xs">
                {heroSettings.heroCtaText} →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Settings Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Upload New Hero Banner Image */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <ImageIcon className="w-5 h-5 text-[#9A6428]" />
              <span>1. Upload New Hero Banner Image</span>
            </h3>

            {/* Drag Drop & File Picker */}
            <div className="border-2 border-dashed border-[#9A6428]/40 rounded-2xl p-6 bg-[#F9EFDD]/30 text-center hover:bg-[#F9EFDD]/60 transition-colors">
              <Upload className="w-8 h-8 text-[#9A6428] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#171717]">
                Click to select a high-resolution hero image (JPG, PNG, WebP)
              </p>
              <p className="text-[11px] text-[#777166] mt-0.5">
                Recommended Resolution: 1920 x 1080 pixels (High Quality)
              </p>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="mt-3 text-xs text-[#777166] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9A6428] file:text-white hover:file:bg-[#80511D] cursor-pointer"
              />
            </div>

            {/* Or Paste Custom Image URL */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-grow px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
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

          {/* Section 2: Banner Headline & Subtitle */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-lg text-[#5E3718] flex items-center gap-2 border-b border-[#E8DDCF] pb-2">
              <Type className="w-5 h-5 text-[#9A6428]" />
              <span>2. Hero Banner Text Content</span>
            </h3>

            <div className="space-y-4">
              {/* Badge Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Top Pill Badge Text
                </label>
                <input
                  type="text"
                  name="heroBadge"
                  value={heroSettings.heroBadge}
                  onChange={handleChange}
                  placeholder="100% Pure & Handcrafted"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Main Headline Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Main Headline Title *
                </label>
                <textarea
                  name="heroTitle"
                  rows="2"
                  required
                  value={heroSettings.heroTitle}
                  onChange={handleChange}
                  placeholder="Discover the Essence of Fresh Spices & Pickles"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm font-serif font-bold focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Supporting Subtitle Paragraph
                </label>
                <textarea
                  name="heroSubtitle"
                  rows="3"
                  value={heroSettings.heroSubtitle}
                  onChange={handleChange}
                  placeholder="Handpicked ingredients, traditional recipes and authentic flavours..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* CTA Button Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Button CTA Label Text
                </label>
                <input
                  type="text"
                  name="heroCtaText"
                  value={heroSettings.heroCtaText}
                  onChange={handleChange}
                  placeholder="Shop Spices & Pickles"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>
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
                  <span>Saving Banner...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Publish Hero Banner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHeroSettings;

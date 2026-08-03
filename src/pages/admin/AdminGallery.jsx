import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Download,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { useGallery } from '../../hooks/useGallery';
import { useToast } from '../../context/ToastContext';
import { validateImageFile } from '../../utils/imageOptimizer';

const CATEGORY_OPTIONS = ['Spices', 'Pickles', 'Grinding', 'Sun-Drying', 'Packaging', 'General'];

export const AdminGallery = () => {
  const { addToast } = useToast();
  const {
    galleryItems,
    loading,
    error,
    storageSource,
    addImages,
    updateImage,
    replaceImage,
    deleteImage,
    toggleActiveStatus,
    reorderImages,
    exportBackup,
    importBackup
  } = useGallery();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All', 'Active', 'Inactive'

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Active item for edit/delete
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Add Form state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // [{ file, previewUrl, valid, error }]
  const [formCategory, setFormCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formAltText, setFormAltText] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Replace file state inside Edit modal
  const [replaceFile, setReplaceFile] = useState(null);
  const [replacePreview, setReplacePreview] = useState('');

  // Import file state
  const [importFile, setImportFile] = useState(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ----------------------------------------------------
  // File Selection & Drag-and-Drop Handlers
  // ----------------------------------------------------
  const processFiles = (filesList) => {
    const filesArray = Array.from(filesList);
    const newPreviews = filesArray.map((file) => {
      const validation = validateImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        previewUrl,
        valid: validation.valid,
        error: validation.error || null
      };
    });

    setSelectedFiles((prev) => [...prev, ...filesArray]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeSelectedFile = (index) => {
    setPreviews((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAddForm = () => {
    previews.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
    setSelectedFiles([]);
    setPreviews([]);
    setFormCategory('General');
    setCustomCategory('');
    setFormTitle('');
    setFormAltText('');
    setFormCaption('');
    setFormIsActive(true);
  };

  const openAddModal = () => {
    resetAddForm();
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    if (submitting) return;
    resetAddForm();
    setIsAddModalOpen(false);
  };

  // ----------------------------------------------------
  // Submit Add Gallery Images
  // ----------------------------------------------------
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const validPreviews = previews.filter((p) => p.valid);
    if (validPreviews.length === 0) {
      addToast('Please select at least one valid image file.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const finalCategory = formCategory === 'Other' ? customCategory || 'General' : formCategory;
      const validFiles = validPreviews.map((p) => p.file);

      await addImages(validFiles, {
        category: finalCategory,
        title: formTitle,
        altText: formAltText,
        caption: formCaption,
        isActive: formIsActive
      });

      addToast(`Successfully added ${validFiles.length} photo(s) to IndexedDB!`, 'success');
      closeAddModal();
    } catch (err) {
      console.error('Failed to add images:', err);
      addToast(err.message || 'Failed to process images.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Edit Modal Handlers
  // ----------------------------------------------------
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormTitle(item.title || '');
    setFormAltText(item.altText || '');
    setFormCaption(item.caption || '');
    setFormCategory(CATEGORY_OPTIONS.includes(item.category) ? item.category : 'Other');
    if (!CATEGORY_OPTIONS.includes(item.category)) {
      setCustomCategory(item.category || '');
    } else {
      setCustomCategory('');
    }
    setFormIsActive(item.isActive ?? true);
    setReplaceFile(null);
    if (replacePreview) URL.revokeObjectURL(replacePreview);
    setReplacePreview('');
    setIsEditModalOpen(true);
  };

  const handleReplaceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const val = validateImageFile(file);
      if (!val.valid) {
        addToast(val.error, 'error');
        return;
      }
      setReplaceFile(file);
      if (replacePreview) URL.revokeObjectURL(replacePreview);
      setReplacePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    try {
      const finalCategory = formCategory === 'Other' ? customCategory || 'General' : formCategory;
      const metadata = {
        title: formTitle,
        altText: formAltText,
        caption: formCaption,
        category: finalCategory,
        isActive: formIsActive
      };

      if (replaceFile) {
        await replaceImage(editingItem.id, replaceFile, metadata);
        addToast('Photo and information updated successfully!', 'success');
      } else {
        await updateImage(editingItem.id, metadata);
        addToast('Photo information updated successfully!', 'success');
      }

      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update photo:', err);
      addToast(err.message || 'Failed to update photo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Delete Handlers
  // ----------------------------------------------------
  const openDeleteModal = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await deleteImage(deletingItem.id);
      addToast('Photo removed from gallery storage.', 'success');
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
      addToast('Failed to delete photo from IndexedDB.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Reorder Handlers
  // ----------------------------------------------------
  const handleMove = async (index, direction) => {
    if (submitting) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const newOrderedItems = [...filteredItems];
    const temp = newOrderedItems[index];
    newOrderedItems[index] = newOrderedItems[targetIndex];
    newOrderedItems[targetIndex] = temp;

    const orderedIds = newOrderedItems.map((item) => item.id);
    setSubmitting(true);
    try {
      await reorderImages(orderedIds);
      addToast('Display order updated.', 'success');
    } catch (err) {
      console.error('Reorder error:', err);
      addToast('Failed to save display order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Backup & Import Handlers
  // ----------------------------------------------------
  const handleExportBackup = async () => {
    try {
      await exportBackup();
      addToast('Gallery backup JSON downloaded successfully!', 'success');
    } catch (err) {
      console.error('Export backup error:', err);
      addToast('Failed to export backup JSON.', 'error');
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) {
      addToast('Please select a valid .json backup file.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const count = await importBackup(importFile);
      addToast(`Restored ${count} photos from backup!`, 'success');
      setIsImportModalOpen(false);
      setImportFile(null);
    } catch (err) {
      console.error('Import error:', err);
      addToast(err.message || 'Failed to import backup.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // Filtered List
  // ----------------------------------------------------
  const categoriesList = Array.from(new Set(galleryItems.map((i) => i.category || 'General')));

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && item.isActive) ||
      (selectedStatus === 'Inactive' && !item.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#9A6428]" />
            <h1 className="font-serif text-2xl font-bold text-[#5E3718]">Photo Gallery Management</h1>
          </div>
          <p className="text-xs text-[#777166]">
            Upload, optimize, and organize high-resolution photos saved directly in browser IndexedDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export Backup Button */}
          <button
            onClick={handleExportBackup}
            disabled={galleryItems.length === 0 || loading || submitting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DDCF] bg-[#F9EFDD]/50 hover:bg-[#F9EFDD] text-[#5E3718] font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Download JSON backup file"
          >
            <Download className="w-4 h-4 text-[#9A6428]" />
            <span>Export Backup</span>
          </button>

          {/* Import Backup Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DDCF] bg-white hover:bg-[#F9EFDD]/30 text-[#5E3718] font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Restore from JSON backup file"
          >
            <UploadCloud className="w-4 h-4 text-[#9A6428]" />
            <span>Restore Backup</span>
          </button>

          {/* Add Photos Button */}
          <button
            onClick={openAddModal}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photos</span>
          </button>
        </div>
      </div>

      {/* Storage Mode Status Banner */}
      <div className="bg-[#FFFBF5] border border-[#9A6428]/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#5E3718]">
        <Info className="w-5 h-5 text-[#9A6428] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold flex items-center gap-2">
            <span>{storageSource === 'vercel_blob' ? 'Vercel Blob Public Cloud Storage Active' : 'IndexedDB Local Fallback Active'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${storageSource === 'vercel_blob' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {storageSource === 'vercel_blob' ? 'Cloud Connected' : 'Local Fallback'}
            </span>
          </p>
          <p className="text-[#777166]">
            {storageSource === 'vercel_blob'
              ? 'Uploaded photos are stored under prefix `gallery/` in Vercel Blob store and persist permanently across all devices, browsers, and site redeployments.'
              : 'Running in local fallback mode. Configure `BLOB_READ_WRITE_TOKEN` in your Vercel project storage settings to enable direct cloud uploads across all devices.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777166]" />
          <input
            type="text"
            placeholder="Search by title, caption, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8DDCF] text-xs focus:outline-none focus:ring-2 focus:ring-[#9A6428] bg-[#FFFBF5]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777166] hover:text-[#171717]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category & Status Filter Selects */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F9EFDD]/50 p-1 rounded-xl border border-[#E8DDCF]">
            {['All', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#9A6428] text-white shadow-xs'
                    : 'text-[#5E3718] hover:bg-[#F9EFDD]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs font-semibold bg-[#FFFBF5] text-[#5E3718] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Gallery List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#777166]">
          <RefreshCw className="w-8 h-8 animate-spin text-[#9A6428]" />
          <p className="text-sm font-semibold">Reading IndexedDB storage...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-bold text-sm">IndexedDB Storage Error</h3>
          <p className="text-xs">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DDCF] p-12 text-center space-y-4">
          <ImageIcon className="w-12 h-12 text-[#9A6428]/40 mx-auto" />
          <h3 className="text-base font-bold text-[#5E3718]">No gallery photos found</h3>
          <p className="text-xs text-[#777166] max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'No photos match your current filter parameters.'
              : 'Upload your first photo to populate the photo gallery.'}
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9A6428] text-white font-bold text-xs shadow-xs hover:bg-[#80511D]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                item.isActive ? 'border-[#E8DDCF]' : 'border-gray-200 opacity-75 bg-gray-50/50'
              }`}
            >
              <div>
                {/* Image Box */}
                <div className="relative aspect-4/3 bg-[#F9EFDD]/30 overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs bg-white/90 backdrop-blur-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    />
                    <span className={item.isActive ? 'text-emerald-700' : 'text-amber-700'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5E3718]/80 text-[#F9EFDD] shadow-xs backdrop-blur-xs">
                    {item.category || 'General'}
                  </div>

                  {/* Reorder Buttons Overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0 || submitting}
                      className="p-1 text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === filteredItems.length - 1 || submitting}
                      className="p-1 text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#5E3718] line-clamp-1">
                      {item.title || 'Untitled Photo'}
                    </h3>
                    <span className="text-[10px] text-[#777166] shrink-0 font-mono">
                      #{(item.displayOrder ?? index) + 1}
                    </span>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-[#777166] line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[10px] text-[#777166] border-t border-[#E8DDCF]/60">
                    <span>File: {item.originalFileName || 'image.jpg'}</span>
                    <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#FFFBF5] border-t border-[#E8DDCF] flex items-center justify-between gap-2">
                {/* Active Toggle */}
                <button
                  onClick={() => toggleActiveStatus(item.id)}
                  disabled={submitting}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    item.isActive
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                  title={item.isActive ? 'Deactivate photo' : 'Activate photo'}
                >
                  {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item)}
                    disabled={submitting}
                    className="p-1.5 rounded-lg text-[#5E3718] hover:bg-[#F9EFDD] transition-colors cursor-pointer"
                    title="Edit details / replace image"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => openDeleteModal(item)}
                    disabled={submitting}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ADD PHOTOS MODAL */}
      {/* ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E8DDCF] shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="p-5 bg-[#5E3718] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#F9EFDD]" />
                <h2 className="font-serif font-bold text-lg text-[#F9EFDD]">Upload Photos to Gallery</h2>
              </div>
              <button
                onClick={closeAddModal}
                disabled={submitting}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#9A6428] bg-[#F9EFDD]/50 scale-102'
                    : 'border-[#E8DDCF] bg-[#FFFBF5] hover:border-[#9A6428] hover:bg-[#F9EFDD]/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-[#9A6428] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#5E3718]">
                  Drag & drop images here, or <span className="text-[#9A6428] underline">browse files</span>
                </p>
                <p className="text-xs text-[#777166] mt-1">
                  Supports JPG, JPEG, PNG, WebP up to 5 MB each. Auto-optimized for crisp display.
                </p>
              </div>

              {/* Selected Files Previews */}
              {previews.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#5E3718]">
                    Selected Photos ({previews.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-[#FFFBF5] rounded-xl border border-[#E8DDCF]">
                    {previews.map((p, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E8DDCF]">
                        <img
                          src={p.previewUrl}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        {!p.valid ? (
                          <div className="absolute inset-0 bg-red-900/80 p-1 flex flex-col items-center justify-center text-center text-white text-[10px]">
                            <AlertCircle className="w-4 h-4 mb-1" />
                            <span>{p.error}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category & Display Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs font-semibold bg-[#FFFBF5] text-[#5E3718] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Custom Category...</option>
                  </select>
                </div>

                {/* Custom Category Input */}
                {formCategory === 'Other' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5E3718] mb-1">Custom Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Festival Special"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                    />
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">Initial Visibility</label>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      formIsActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-amber-50 border-amber-300 text-amber-700'
                    }`}
                  >
                    {formIsActive ? <Check className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{formIsActive ? 'Active (Visible on Gallery)' : 'Inactive (Hidden)'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">Default Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Stone Grinding"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">Alt Text (Accessibility)</label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh chilli grinding process"
                    value={formAltText}
                    onChange={(e) => setFormAltText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Caption / Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short description displayed inside lightbox view..."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E8DDCF] text-[#5E3718] hover:bg-[#F9EFDD]/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || previews.filter((p) => p.valid).length === 0}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save to Gallery</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / REPLACE MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E8DDCF] shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-[#5E3718] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F9EFDD]" />
                <h2 className="font-serif font-bold text-lg text-[#F9EFDD]">Edit Photo Details</h2>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={submitting}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Current Image & Replace Option */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#5E3718]">Current Image</label>
                <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#E8DDCF] bg-[#F9EFDD]/40">
                  <img
                    src={replacePreview || editingItem.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {replacePreview && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-amber-500 text-white text-[10px] font-bold">
                      Replaced
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-xs font-bold text-[#9A6428] hover:underline inline-flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image File</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleReplaceFileChange}
                      className="hidden"
                    />
                  </label>
                  {replaceFile && (
                    <span className="text-[10px] text-[#777166] truncate max-w-[200px]">
                      {replaceFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Alt Text</label>
                <input
                  type="text"
                  value={formAltText}
                  onChange={(e) => setFormAltText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs font-semibold bg-[#FFFBF5] text-[#5E3718] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Custom Category...</option>
                </select>
              </div>

              {formCategory === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">Custom Category Name</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DDCF] text-xs bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">Status</label>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    formIsActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-amber-50 border-amber-300 text-amber-700'
                  }`}
                >
                  {formIsActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{formIsActive ? 'Active (Visible on public gallery)' : 'Hidden (Inactive)'}</span>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E8DDCF] text-[#5E3718] hover:bg-[#F9EFDD]/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ---------------------------------------------------- */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-[#E8DDCF] shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#5E3718]">Delete Photo?</h3>
              <p className="text-xs text-[#777166]">
                Are you sure you want to delete <span className="font-semibold text-[#171717]">"{deletingItem.title || deletingItem.originalFileName}"</span>? This action will remove it permanently from IndexedDB.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E8DDCF] text-[#5E3718] hover:bg-[#F9EFDD]/50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* IMPORT BACKUP MODAL */}
      {/* ---------------------------------------------------- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E8DDCF] shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#5E3718] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#F9EFDD]" />
                <h2 className="font-serif font-bold text-lg text-[#F9EFDD]">Restore Gallery Backup</h2>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                disabled={submitting}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Restoring a JSON backup file will <span className="font-bold underline">replace</span> all current photos stored in IndexedDB. Make sure you have exported a current backup if needed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1">
                  Select Backup JSON File
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setImportFile(e.target.files[0] || null)}
                  className="w-full text-xs text-[#5E3718] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F9EFDD] file:text-[#5E3718] hover:file:bg-[#9A6428] hover:file:text-white transition-colors cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E8DDCF] text-[#5E3718] hover:bg-[#F9EFDD]/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importFile || submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <span>Restore Gallery</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;

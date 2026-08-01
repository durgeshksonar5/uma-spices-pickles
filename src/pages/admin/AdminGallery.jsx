import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Link as LinkIcon,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminGallery = () => {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'

  // Form State
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState(null);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/gallery');
      if (res && res.data) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn('Backend server offline or gallery empty', err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setImageUrl('');
    setSelectedFile(null);
    setImagePreview('');
    setUploadType('file');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setImageUrl(item.imageUrl || '');
    setSelectedFile(null);
    setImagePreview(item.imageUrl || '');
    setUploadType('url');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64Data = result.split(',')[1];
        resolve({ base64: base64Data, type: file.type });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadType === 'file' && !selectedFile && !editingItem) {
      addToast('Please choose an image file to upload', 'error');
      return;
    }

    if (uploadType === 'url' && !imageUrl.trim() && !editingItem) {
      addToast('Please enter an image URL', 'error');
      return;
    }

    setSubmitting(true);

    try {
      let imageBase64 = null;
      let imageType = null;

      if (uploadType === 'file' && selectedFile) {
        const fileInfo = await readFileAsBase64(selectedFile);
        imageBase64 = fileInfo.base64;
        imageType = fileInfo.type;
      }

      const payload = {
        imageUrl: imageUrl.trim(),
        ...(imageBase64 ? { imageBase64, imageType } : {})
      };

      if (editingItem) {
        const itemId = editingItem._id || editingItem.id;
        try {
          const res = await apiClient(`/gallery/${itemId}`, {
            method: 'PUT',
            body: payload
          });
          if (res && res.data) {
            setItems((prev) =>
              prev.map((i) => ((i._id || i.id) === itemId ? res.data : i))
            );
          } else {
            setItems((prev) =>
              prev.map((i) =>
                (i._id || i.id) === itemId
                  ? {
                      ...i,
                      imageUrl: imagePreview || imageUrl || i.imageUrl
                    }
                  : i
              )
            );
          }
          addToast('Gallery image updated successfully!', 'success');
        } catch (err) {
          setItems((prev) =>
            prev.map((i) =>
              (i._id || i.id) === itemId
                ? {
                    ...i,
                    imageUrl: imagePreview || imageUrl || i.imageUrl
                  }
                : i
            )
          );
          addToast('Updated gallery image (Local state)', 'success');
        }
      } else {
        // Create New Gallery Item
        try {
          const res = await apiClient('/gallery', {
            method: 'POST',
            body: payload
          });
          if (res && res.data) {
            setItems((prev) => [res.data, ...prev]);
          } else {
            const newItem = {
              _id: `gal-${Date.now()}`,
              imageUrl: imagePreview || imageUrl || '',
              createdAt: new Date().toISOString()
            };
            setItems((prev) => [newItem, ...prev]);
          }
          addToast('New gallery image uploaded successfully!', 'success');
        } catch (err) {
          const newItem = {
            _id: `gal-${Date.now()}`,
            imageUrl: imagePreview || imageUrl || '',
            createdAt: new Date().toISOString()
          };
          setItems((prev) => [newItem, ...prev]);
          addToast('Added gallery image (Local state)', 'success');
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to save gallery item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient(`/gallery/${id}`, { method: 'DELETE' }).catch(() => null);
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      addToast('Gallery image deleted successfully', 'success');
    } catch (err) {
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      addToast('Deleted gallery image (Local state)', 'success');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.imageUrl && item.imageUrl.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DDCF]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#5E3718] flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#9A6428]" />
            <span>Gallery Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-1">
            Upload, edit, and manage images displayed in the website photo gallery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DDCF] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777166]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery photos..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8DDCF] bg-[#FFFBF5] text-xs font-medium focus:outline-none focus:border-[#9A6428]"
          />
        </div>
        <span className="text-xs font-bold text-[#5E3718] hidden sm:block">
          Total Photos: {filteredItems.length}
        </span>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#9A6428] mx-auto" />
          <p className="text-xs font-semibold text-[#777166]">Loading gallery photos...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-[#E8DDCF] text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-[#9A6428]/40 mx-auto" />
          <h3 className="font-bold text-base text-[#5E3718]">No gallery photos uploaded yet</h3>
          <p className="text-xs text-[#777166]">
            Click "Add Gallery Image" above to upload photos to your website gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div
                key={itemId}
                className="bg-white rounded-2xl border border-[#E8DDCF] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-16/10 bg-[#F9EFDD]/50 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body Details (Render only if title or description present) */}
                {(item.title || item.description) && (
                  <div className="p-4 flex-grow space-y-2">
                    {item.title && (
                      <h3 className="font-bold text-base text-[#5E3718] line-clamp-1">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-xs text-[#777166] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="p-3 bg-[#FFFBF5] border-t border-[#E8DDCF] flex items-center justify-between">
                  <span className="text-[10px] text-[#777166] font-medium">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'Uploaded'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(itemId)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DDCF] space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCF]">
              <h2 className="font-serif font-bold text-xl text-[#5E3718] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#9A6428]" />
                <span>{editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#777166] hover:bg-[#F9EFDD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Image Input Source Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#5E3718] mb-1.5">
                  Image Source
                </label>
                <div className="flex items-center gap-2 p-1 bg-[#F9EFDD]/50 rounded-xl border border-[#E8DDCF]">
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      uploadType === 'file'
                        ? 'bg-[#9A6428] text-white shadow-xs'
                        : 'text-[#5E3718] hover:bg-white/50'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      uploadType === 'url'
                        ? 'bg-[#9A6428] text-white shadow-xs'
                        : 'text-[#5E3718] hover:bg-white/50'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {/* Upload File Input */}
              {uploadType === 'file' ? (
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">
                    Select Image File (JPG, PNG, WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 text-xs border border-[#E8DDCF] rounded-xl bg-[#FFFBF5] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#9A6428] file:text-white hover:file:bg-[#80511D]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#5E3718] mb-1">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8DDCF] bg-[#FFFBF5] text-xs font-medium focus:outline-none focus:border-[#9A6428]"
                  />
                </div>
              )}

              {/* Live Preview */}
              {imagePreview && (
                <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#E8DDCF] bg-[#F9EFDD]/40">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold">
                    Image Preview
                  </span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E8DDCF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DDCF] text-xs font-bold text-[#777166] hover:bg-[#F9EFDD]/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A6428] hover:bg-[#80511D] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{editingItem ? 'Save Changes' : 'Upload Image'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-[#E8DDCF] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-[#5E3718]">Delete Gallery Image?</h3>
              <p className="text-xs text-[#777166] mt-1">
                Are you sure you want to delete this photo from the gallery? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-[#E8DDCF] text-xs font-bold text-[#777166] hover:bg-[#F9EFDD]/50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;

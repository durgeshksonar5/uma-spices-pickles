import React, { useState, useEffect } from 'react';
import { testimonialApi } from '../../api/testimonialApi';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  PlusCircle,
  Star,
  Trash2,
  Edit,
  RefreshCw,
  AlertTriangle,
  X,
  Check,
  MapPin,
  User
} from 'lucide-react';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    review: ''
  });

  const { showToast } = useToast();

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await testimonialApi.getTestimonials();
      if (res?.success && Array.isArray(res.data)) {
        setTestimonials(res.data);
      }
    } catch (err) {
      showToast('Failed to load testimonials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTarget(null);
    setFormData({ name: '', location: '', rating: 5, review: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTarget(t);
    setFormData({
      name: t.name || '',
      location: t.location || '',
      rating: t.rating || 5,
      review: t.review || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim()) {
      showToast('Please enter both customer name and review text', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (editingTarget) {
        res = await testimonialApi.updateTestimonial(editingTarget._id || editingTarget.id, formData);
      } else {
        res = await testimonialApi.createTestimonial(formData);
      }

      if (res.success) {
        showToast(
          editingTarget ? 'Testimonial updated successfully!' : 'Testimonial added successfully!',
          'success'
        );
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    setIsDeleting(true);

    // Optimistic UI update
    setTestimonials((prev) => prev.filter((t) => (t._id || t.id) !== targetId));

    try {
      const res = await testimonialApi.deleteTestimonial(targetId);
      if (res.success) {
        showToast('Testimonial deleted successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete testimonial', 'error');
      fetchTestimonials();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            Customer Testimonials Management
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Add, edit, or delete customer reviews displayed on the homepage review slider.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTestimonials}
            className="px-3.5 py-2 rounded-xl bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#9A6428] text-white hover:bg-[#80511D] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Testimonials Grid / List */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#5E3718] font-serif">Loading Customer Testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-[#E8DDCF] text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-[#9A6428] mx-auto opacity-50" />
          <p className="text-base font-bold text-[#5E3718]">No customer testimonials added yet.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#9A6428] text-white font-bold text-xs"
          >
            Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t._id || t.id}
              className="bg-white rounded-3xl border border-[#E8DDCF] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-3">
                {/* Rating Stars & Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#E9A900]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="p-2 rounded-lg bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(t)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Review Quote Text */}
                <p className="text-xs sm:text-sm text-[#171717] italic leading-relaxed">
                  "{t.review}"
                </p>
              </div>

              {/* Customer Footer Meta */}
              <div className="pt-4 border-t border-[#E8DDCF] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9A6428] text-white font-bold text-xs flex items-center justify-center border border-[#F9EFDD] shrink-0">
                  {t.initials || (t.name ? t.name.slice(0, 2).toUpperCase() : 'VC')}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#5E3718]">{t.name}</h4>
                  <p className="text-[11px] text-[#25D366] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{t.location || 'Verified Customer'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDCF] p-6 max-w-lg w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#5E3718]">
                {editingTarget ? 'Edit Customer Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#777166] hover:bg-[#F9EFDD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Deshmukh"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Rating Stars (1 - 5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                  Customer Review Quote *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Enter customer feedback quote..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9A6428]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DDCF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F9EFDD] text-[#5E3718] hover:bg-[#E8DDCF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#9A6428] text-white hover:bg-[#80511D] flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTarget ? 'Update Testimonial' : 'Save Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDCF] p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#5E3718]">
              Delete Testimonial?
            </h3>
            <p className="text-xs text-[#777166]">
              Are you sure you want to delete the testimonial from <strong>"{deleteTarget.name}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F9EFDD] text-[#5E3718] hover:bg-[#E8DDCF] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;

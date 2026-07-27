import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Trash2,
  Edit
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    outOfStock: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete product state
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getProducts({ admin: 'true', limit: 50 });
      if (res.success && res.data) {
        const prods = res.data;
        setStats({
          total: prods.length,
          published: prods.filter((p) => p.status === 'published').length,
          draft: prods.filter((p) => p.status === 'draft').length,
          outOfStock: prods.filter((p) => p.status === 'out-of-stock' || p.stock === 0).length
        });
        setRecentProducts(prods.slice(0, 8));
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteProductTarget) return;
    const targetId = deleteProductTarget._id || deleteProductTarget.id;
    const targetName = deleteProductTarget.name;
    const targetStatus = deleteProductTarget.status;

    setIsDeleting(true);

    // Instant optimistic update on UI
    setRecentProducts((prev) => prev.filter((p) => (p._id || p.id) !== targetId));
    setStats((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
      published: targetStatus === 'published' ? Math.max(0, prev.published - 1) : prev.published,
      draft: targetStatus === 'draft' ? Math.max(0, prev.draft - 1) : prev.draft,
      outOfStock: targetStatus === 'out-of-stock' ? Math.max(0, prev.outOfStock - 1) : prev.outOfStock
    }));

    try {
      const res = await productApi.deleteProduct(targetId);
      if (res.success) {
        showToast(`"${targetName}" deleted successfully!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
      // Re-fetch to sync if network failed
      fetchDashboardData();
    } finally {
      setIsDeleting(false);
      setDeleteProductTarget(null);
    }
  };

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Monitor real-time product statistics, status breakdown and inventory management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="px-3.5 py-2 rounded-xl bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>

          <Link
            to="/admin/products/add"
            className="px-4 py-2.5 rounded-xl bg-[#9A6428] text-white hover:bg-[#80511D] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-2xl border border-[#E8DDCF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#777166] uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#9A6428]/15 text-[#9A6428] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-3xl text-[#171717]">
              {isLoading ? '...' : stats.total}
            </span>
            <p className="text-[11px] text-[#777166] mt-1">In backend catalog</p>
          </div>
        </div>

        {/* Card 2: Published Products */}
        <div className="bg-white rounded-2xl border border-[#E8DDCF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#777166] uppercase tracking-wider">
              Published
            </span>
            <div className="w-10 h-10 rounded-xl bg-green-100 text-[#25D366] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-3xl text-[#171717]">
              {isLoading ? '...' : stats.published}
            </span>
            <p className="text-[11px] text-[#25D366] font-semibold mt-1">Visible on Shop page</p>
          </div>
        </div>

        {/* Card 3: Draft Products */}
        <div className="bg-white rounded-2xl border border-[#E8DDCF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#777166] uppercase tracking-wider">
              Drafts
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-3xl text-[#171717]">
              {isLoading ? '...' : stats.draft}
            </span>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Unpublished drafts</p>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white rounded-2xl border border-[#E8DDCF] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#777166] uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-3xl text-[#171717]">
              {isLoading ? '...' : stats.outOfStock}
            </span>
            <p className="text-[11px] text-red-600 font-semibold mt-1">Requires restock</p>
          </div>
        </div>
      </div>

      {/* Recent Products Table Section */}
      <div className="bg-white rounded-2xl border border-[#E8DDCF] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#9A6428]" />
            <h3 className="font-serif text-lg font-bold text-[#5E3718]">
              Recently Added Products
            </h3>
          </div>

          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#9A6428] hover:text-[#5E3718] flex items-center gap-1 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8DDCF] text-[#777166] uppercase tracking-wider font-bold bg-[#F9EFDD]/40">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDCF]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-[#777166]">
                    Loading products...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-[#777166]">
                    No products found in backend database.
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => {
                  const imgUrl = p.images && p.images.length > 0 ? p.images[0].url : '';
                  return (
                    <tr key={p._id || p.id} className="hover:bg-[#F9EFDD]/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E8DDCF] bg-white shrink-0">
                          <img
                            src={imgUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{p.name}</p>
                          <p className="text-[11px] text-[#777166]">{p.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{p.sku || '-'}</td>
                      <td className="py-3 px-4 capitalize font-semibold">{p.category}</td>
                      <td className="py-3 px-4 font-bold">{formatCurrency(p.basePrice || p.price)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            p.status === 'published'
                              ? 'bg-green-100 text-[#25D366]'
                              : p.status === 'draft'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.status || 'published'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <Link
                            to={`/admin/products/edit/${p._id || p.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#9A6428] text-white text-[11px] font-bold hover:bg-[#80511D] transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteProductTarget(p)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProductTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDCF] p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#5E3718]">
              Delete Product?
            </h3>
            <p className="text-xs text-[#777166]">
              Are you sure you want to permanently delete <strong>"{deleteProductTarget.name}"</strong>?
              This action will immediately remove the product from your catalog and website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteProductTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F9EFDD] text-[#5E3718] hover:bg-[#E8DDCF] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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

export default AdminDashboard;

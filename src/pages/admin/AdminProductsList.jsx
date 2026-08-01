import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../data/categories';
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Delete modal state
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getProducts({
        admin: 'true',
        limit: 100,
        search,
        category: categoryFilter !== 'all' ? categoryFilter : '',
        status: statusFilter !== 'all' ? statusFilter : ''
      });
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Quick Toggle Status (Publish / Unpublish)
  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await productApi.updateStatus(product._id || product.id, newStatus);
      if (res.success) {
        showToast(`Product status updated to ${newStatus}`, 'success');
        setProducts((prev) =>
          prev.map((p) =>
            (p._id || p.id) === (product._id || product.id) ? { ...p, status: newStatus } : p
          )
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Instant Delete Confirm with Optimistic State Update
  const handleDeleteConfirm = async () => {
    if (!deleteProductTarget) return;
    const targetId = deleteProductTarget._id || deleteProductTarget.id;
    const targetName = deleteProductTarget.name;

    setIsDeleting(true);
    // Instant optimistic update on UI
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== targetId));

    try {
      const res = await productApi.deleteProduct(targetId);
      if (res.success) {
        showToast(`"${targetName}" deleted successfully!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
      fetchProducts();
    } finally {
      setIsDeleting(false);
      setDeleteProductTarget(null);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E3718]">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-[#777166] mt-0.5">
            Add, edit, publish, unpublish, and delete products from your catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="px-3.5 py-2 rounded-xl bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DDCF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFBF5] border border-[#E8DDCF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A6428] text-[#171717]"
          />
          <Search className="w-4 h-4 text-[#777166] absolute left-3 top-2.5" />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-[#FFFBF5] px-3 py-1.5 rounded-xl border border-[#E8DDCF]">
            <Filter className="w-3.5 h-3.5 text-[#9A6428]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent focus:outline-none text-[#171717] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFFBF5] px-3 py-1.5 rounded-xl border border-[#E8DDCF]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent focus:outline-none text-[#171717] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-[#E8DDCF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8DDCF] text-[#777166] uppercase tracking-wider font-bold bg-[#F9EFDD]/50">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDCF]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#777166]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-3 border-[#9A6428] border-t-transparent rounded-full animate-spin"></div>
                      <span>Fetching products from backend...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#777166]">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const imgUrl = p.images && p.images.length > 0 
                    ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url || '') 
                    : '';
                  return (
                    <tr key={p._id || p.id} className="hover:bg-[#F9EFDD]/30 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E8DDCF] bg-[#FFFBF5] shrink-0">
                          <img
                            src={imgUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#171717] text-sm">{p.name}</p>
                          <p className="text-[11px] text-[#777166]">{p.slug}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{p.sku || '-'}</td>
                      <td className="py-3.5 px-4 capitalize font-semibold">{p.category}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#171717]">
                          {formatCurrency(p.basePrice || p.price) || '-'}
                        </div>
                        {p.salePrice && p.salePrice > 0 && p.salePrice < p.basePrice && (
                          <span className="text-[10px] text-green-600 font-bold block">
                            Sale: {formatCurrency(p.salePrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={p.stock === 0 ? 'text-red-600' : 'text-[#171717]'}>
                          {p.stock ?? 50} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title={p.status === 'published' ? 'Unpublish (Make Draft)' : 'Publish to Shop'}
                            className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              p.status === 'published'
                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {p.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <Link
                            to={`/admin/products/edit/${p._id || p.id}`}
                            className="p-2 rounded-lg bg-[#F9EFDD] text-[#5E3718] border border-[#E8DDCF] hover:bg-[#9A6428] hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeleteProductTarget(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
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
              This action cannot be undone and will remove the product from your catalog and website.
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

export default AdminProductsList;

import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { businessConfig } from '../../config/businessConfig';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderPlus,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Store,
  Image as ImageIcon,
  MessageSquare,
  Gift
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'All Products', path: '/admin/products', icon: Package, end: true },
    { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle, end: true },
    { label: 'Add Category', path: '/admin/categories/add', icon: FolderPlus, end: true },
    { label: 'Hero Banner', path: '/admin/hero-banner', icon: ImageIcon, end: true },
    { label: 'Festive Deal', path: '/admin/festive-deal', icon: Gift, end: true },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare, end: true }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#171717] flex flex-col md:flex-row font-sans">
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#5E3718] text-white flex flex-col justify-between p-5 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header / Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-[#9A6428]/40">
            <Link to="/admin" className="flex flex-col text-left">
              <span className="font-serif font-bold text-xl text-[#F9EFDD] tracking-wider uppercase">
                {businessConfig.brandName} Admin
              </span>
              <span className="text-[10px] text-[#E8DDCF]/80 font-semibold tracking-widest uppercase">
                Control Center
              </span>
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-[#9A6428] text-white shadow-md'
                        : 'text-[#F9EFDD]/80 hover:bg-[#9A6428]/30 hover:text-white'
                    }`
                  }
                >
                  <IconComp className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="pt-6 border-t border-[#9A6428]/40 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#9A6428] flex items-center justify-center text-white font-bold text-sm border border-[#F9EFDD]/30 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#F9EFDD]/70 truncate">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/shop"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            <Store className="w-4 h-4 text-[#F9EFDD]" />
            <span>Visit Live Shop</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Right Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E8DDCF] py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#F9EFDD] text-[#5E3718] hover:bg-[#9A6428] hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#25D366]" />
              <span className="text-xs sm:text-sm font-bold text-[#5E3718]">
                Admin Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#9A6428] hover:text-[#5E3718] bg-[#F9EFDD]/60 px-3.5 py-1.5 rounded-full border border-[#E8DDCF] transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 flex-grow max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, Menu, Search, Pill } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Pill size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary hidden sm:block">
            APR Osean
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search medicines, brands..."
            className="w-full bg-secondary/50 border-none rounded-full py-2 px-4 focus:ring-2 ring-primary outline-none text-sm"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Desktop Menu */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/products" className="text-gray-600 hover:text-primary font-medium text-sm">
            Shop
          </Link>

          {user?.role !== 'USER' && user && (
            <Link href="/admin" className="text-gray-600 hover:text-primary font-medium text-sm">
              Dashboard
            </Link>
          )}

          <Link href="/cart" className="relative group">
            <ShoppingCart className="text-gray-600 group-hover:text-primary transition-colors" size={22} />
            {cart?.items && cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors">
                <User size={20} />
                <span className="text-sm font-medium hidden lg:block">{user.name || user.phone_number}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-xs text-red-500 font-medium border border-red-200 px-2 py-1 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/auth/login" 
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-md active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

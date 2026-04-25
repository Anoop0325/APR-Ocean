'use client';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
        {Number(product.discount_percent) > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {Math.round(Number(product.discount_percent))}% OFF
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
          {product.brand}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
          ))}
          <span className="text-[10px] text-gray-400">(4.0)</span>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">Rs. {product.final_price}</span>
            {Number(product.discount_percent) > 0 && (
              <span className="ml-2 text-xs text-gray-400 line-through">Rs. {product.mrp}</span>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product.id)}
            disabled={product.stock === 0}
            className={`p-2 rounded-full transition-all ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-hover active:scale-90 shadow-md'
            }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        {product.stock === 0 && (
          <p className="text-[10px] text-red-500 font-bold uppercase mt-1">Out of Stock</p>
        )}
      </div>
    </div>
  );
}

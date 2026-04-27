'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch, getImageUrl } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Shield, RotateCcw, Truck, Star } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await apiFetch(`/store/products/${id}/`);
      if (res.ok) setProduct(await res.json());
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto p-20 text-center animate-pulse">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto p-20 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center justify-center">
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.name} className="max-h-[400px] object-contain" />
          ) : (
            <div className="text-gray-300 font-bold text-xl uppercase tracking-widest text-center">
              <div className="bg-secondary p-8 rounded-full mb-4 mx-auto w-32 h-32 flex items-center justify-center">No Image</div>
              {product.name}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2">
               <div className="flex text-yellow-400">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />)}
               </div>
               <span className="text-sm text-gray-500 font-medium">(12 Customer Reviews)</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
             <span className="text-3xl font-bold text-primary">Rs. {product.final_price}</span>
             {Number(product.discount_percent) > 0 && (
               <>
                 <span className="text-lg text-gray-400 line-through">Rs. {product.mrp}</span>
                 <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-lg">-{Math.round(Number(product.discount_percent))}%</span>
               </>
             )}
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-2 hover:bg-gray-50">-</button>
                <span className="px-6 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="px-4 py-2 hover:bg-gray-50">+</button>
              </div>
              <button 
                onClick={() => addToCart(product.id, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Heart size={20} />
              </button>
            </div>
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-xs text-orange-500 font-bold">Only {product.stock} units left in stock!</p>
            )}
             {product.stock === 0 && (
              <p className="text-xs text-red-500 font-bold">Currently Out of Stock</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={20} className="text-primary" /> <span>Free Shipping</span>
            </div>
             <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield size={20} className="text-primary" /> <span>Authentic Gaurantee</span>
            </div>
             <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw size={20} className="text-primary" /> <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

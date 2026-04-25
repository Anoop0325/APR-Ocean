'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, CreditCard, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold">Please login to see your cart</h2>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg"
        >
          Login Now
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
         <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button 
          onClick={() => router.push('/products')}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        Your Cart <span className="text-lg text-gray-400 font-normal">({cart.items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 md:gap-6 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center">
                 {item.product.image ? (
                   <img src={item.product.image} className="w-full h-full object-cover rounded-xl" />
                 ) : (
                   <span className="text-gray-300 text-xs text-center px-2">{item.product.name}</span>
                 )}
              </div>
              
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                  <p className="text-xs text-gray-400">{item.product.brand}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-primary">Rs. {(Number(item.product.final_price) * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">Rs. {item.product.final_price} / unit</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => updateQuantity(item.id, 0)}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6 sticky top-24">
            <h2 className="font-bold text-xl">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">Rs. {cart.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-xl text-primary">Rs. {cart.total_price.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 shadow-primary/20"
            >
              Checkout <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center justify-center gap-4 text-gray-300">
               <Truck size={20} />
               <CreditCard size={20} />
               <ShoppingBag size={20} />
            </div>

            <p className="text-[10px] text-center text-gray-400 px-4">
              Step 1 of 2: Cart ➔ Checkout ➔ Order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

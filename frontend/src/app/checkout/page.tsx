'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { apiFetch, getImageUrl } from '@/lib/api';
import { Address as AddressType } from '@/types';
import { 
  MapPin, Plus, CheckCircle2, ChevronRight, 
  CreditCard, Smartphone, Banknote, ShieldCheck,
  Truck, ArrowLeft, Loader2, AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await apiFetch('/auth/addresses/');
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
      if (data.length > 0) {
        // Find default or first address
        const def = data.find((a: any) => a.is_default) || data[0];
        setSelectedAddress(def.id);
        setShowAddressForm(false);
      } else {
        setShowAddressForm(true); // Show form if no addresses
      }
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiFetch('/auth/addresses/', {
      method: 'POST',
      body: JSON.stringify(newAddress)
    });
    if (res.ok) {
      await fetchAddresses();
    }
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setStep(1);
      return;
    }
    setLoading(true);
    
    try {
      const res = await apiFetch('/orders/checkout/', {
        method: 'POST',
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method: paymentMethod
        })
      });

      if (res.ok) {
        const order = await res.json();
        if (paymentMethod === 'ONLINE') {
          handleRazorpay(order);
        } else {
          clearCart();
          router.push(`/orders/${order.id}/success`);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Checkout failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = (order: any) => {
    const options = {
      key: "rzp_test_placeholder",
      amount: order.total_amount * 100,
      currency: "INR",
      name: "APR Ocean Enterprise",
      description: `Order #${order.id}`,
      order_id: order.razorpay_order_id,
      handler: async function(response: any) {
        setLoading(true);
        const verifyRes = await apiFetch('/orders/verify-payment/', {
          method: 'POST',
          body: JSON.stringify({
            order_id: order.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        });
        if (verifyRes.ok) {
          clearCart();
          router.push(`/orders/${order.id}/success`);
        } else {
          alert('Payment verification failed');
        }
        setLoading(false);
      },
      prefill: {
        name: user?.name,
        contact: user?.phone_number
      },
      theme: { color: "#4CAF50" }
    };
    
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="bg-gray-50 p-8 rounded-full text-gray-200"><AlertCircle size={80}/></div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => router.push('/products')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg">Start Shopping</button>
      </div>
    );
  }

  const selectedAddrObj = addresses.find(a => a.id === selectedAddress);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* ProgressBar */}
      <div className="flex items-center justify-center gap-4 mb-16 px-4 overflow-x-auto no-scrollbar">
        {[1, 2].map((num) => (
          <div key={num} className="flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${step >= num ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white border-gray-100 text-gray-300'}`}>
              {step > num ? <CheckCircle2 size={24}/> : num}
            </div>
            {num < 2 && <div className={`w-12 md:w-24 h-1 rounded-full transition-all ${step > num ? 'bg-primary' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3"><MapPin className="text-primary"/> Delivery Address</h2>
                {addresses.length > 0 && (
                  <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-primary font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus size={18}/> {showAddressForm ? 'Select Existing' : 'Add New'}
                </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddAddress} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Full name</label>
                        <input required value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Phone</label>
                        <input required value={user?.phone_number} disabled className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 outline-none opacity-60" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Street Address</label>
                      <input required value={newAddress.street_address} onChange={e => setNewAddress({...newAddress, street_address: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-primary outline-none" />
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">City</label>
                        <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">State</label>
                        <input required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-primary outline-none" />
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Pincode</label>
                        <input required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 ring-primary outline-none" />
                      </div>
                   </div>
                   <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? <Loader2 className="animate-spin"/> : 'Save & Deliver Here'}
                   </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`cursor-pointer p-6 rounded-[2rem] border-2 transition-all group ${selectedAddress === addr.id ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-lg">{addr.full_name}</p>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                          {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in" />}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{addr.street_address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3"><CreditCard className="text-primary"/> Payment</h2>
                {selectedAddrObj && (
                  <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase truncate max-w-[150px]">To: {selectedAddrObj.full_name}</p>
                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-primary hover:underline">Change</button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:bg-gray-50 bg-white'}`}
                >
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'COD' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                     <Banknote size={32} />
                   </div>
                   <div className="flex-1">
                      <p className="font-bold text-xl">Cash on Delivery</p>
                      <p className="text-gray-400 text-sm">Pay when your packet arrives</p>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
                   </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:bg-gray-50 bg-white'}`}
                >
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'ONLINE' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                     <Smartphone size={32} />
                   </div>
                   <div className="flex-1">
                      <p className="font-bold text-xl">Online Payment (Razorpay)</p>
                      <p className="text-gray-400 text-sm">Cards, UPI, Netbanking - Secure Payment</p>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                      {paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-white" />}
                   </div>
                </div>
              </div>

              {paymentMethod === 'ONLINE' && (
                <div className="bg-gray-50 p-10 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top duration-300">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">We Support All Modes</p>
                   <div className="flex justify-center gap-8 text-gray-400 grayscale opacity-50">
                      <CreditCard size={32} />
                      <Smartphone size={32} />
                      <MapPin size={32} />
                   </div>
                   <div className="bg-white p-4 rounded-xl flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                      <ShieldCheck size={18}/> 100% Encrypted & Secure
                   </div>
                </div>
              )}
            </div>
          )}

          <div className="flex pt-4">
             {step > 1 && (
               <button 
                 onClick={() => setStep(s => s - 1)}
                 className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
               >
                 <ArrowLeft size={18}/> Go Back
               </button>
             )}
          </div>
        </div>

        {/* SIDE BAR SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 sticky top-24">
            <h3 className="text-xl font-bold border-b border-gray-50 pb-4">Order Summary</h3>
            
            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 no-scrollbar">
               {cart.items.map(item => (
                 <div key={item.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-300 overflow-hidden shrink-0">
                       {item.product.image ? <img src={getImageUrl(item.product.image)} className="w-full h-full object-cover"/> : 'IMG'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-sm truncate">{item.product.name}</p>
                       <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">Rs. {Number(item.product.final_price) * item.quantity}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
               <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {cart.total_price}</span>
               </div>
               <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">FREE</span>
               </div>
               <div className="flex justify-between items-center text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary tracking-tight">Rs. {cart.total_price}</span>
               </div>
            </div>

            {step === 1 ? (
              <button 
                onClick={() => setStep(2)}
                disabled={!selectedAddress || showAddressForm}
                className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                Proceed to Payment <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin"/> : `Place Order (Rs. ${cart.total_price})`}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
               <Truck size={14}/> Express Medical Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

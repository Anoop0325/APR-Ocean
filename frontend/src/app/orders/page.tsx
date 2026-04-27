'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Package, ChevronRight, Clock, MapPin, Search, AlertCircle, Loader2 } from 'lucide-react';
import OrderDetailModal from '@/components/OrderDetailModal';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await apiFetch('/orders/orders/');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-50 text-green-700 ring-green-100';
      case 'PENDING': return 'bg-amber-50 text-amber-700 ring-amber-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-700 ring-blue-100';
      default: return 'bg-gray-50 text-gray-700 ring-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Your History...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 font-medium">Track and manage your medical supplies</p>
        </div>
        <div className="w-16 h-16 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
          <Package size={32} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center space-y-6 shadow-xl">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
            <AlertCircle size={60} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start shopping now!</p>
          </div>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-hover transition-all active:scale-95 shadow-primary/20"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-[2.2rem] border border-gray-100 p-6 md:p-8 hover:border-primary/30 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Package size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-gray-800 tracking-tight">Order #{order.id}</p>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ring-1 ring-inset ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(order.created_at)}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {order.address_details?.city || 'Delivery'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Grand Total</p>
                    <p className="text-xl font-black text-primary tracking-tighter">₹{order.total_amount}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

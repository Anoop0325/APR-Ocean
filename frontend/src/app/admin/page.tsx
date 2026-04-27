'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Package, Star, AlertTriangle, MessageSquare, BarChart3, TrendingUp, Search, Plus, Edit2, ShoppingBag, ChevronDown, CheckCircle, Truck, Clock, ClipboardList, Trash2 } from 'lucide-react';
import ProductModal from '@/components/ProductModal';
import OrderDetailModal from '@/components/OrderDetailModal';
import { Product, Category } from '@/types';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'ratings' | 'orders'>('inventory');
  const [data, setData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'USER')) {
      router.push('/');
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    try {
      const endpoint = activeTab === 'inventory' ? '/store/admin/inventory/' : 
                       activeTab === 'ratings' ? '/store/admin/ratings/' : '/orders/admin/dashboard/';
      const [dataRes, catRes] = await Promise.all([
        apiFetch(endpoint),
        apiFetch('/store/categories/')
      ]);
      
      if (dataRes.ok) setData(await dataRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'USER') fetchData();
  }, [activeTab, user]);

  const filteredInventory = useMemo(() => {
    if (!data?.products) return [];
    return data.products.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const filteredReviews = useMemo(() => {
    if (!data?.recent_reviews) return [];
    return data.recent_reviews.filter((r: any) => 
      r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleEdit = async (productId: number) => {
    try {
      const res = await apiFetch(`/store/admin/products/${productId}/`);
      if (res.ok) {
        setEditingProduct(await res.json());
        setShowModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await apiFetch(`/store/admin/products/${productId}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter((o: any) => 
      o.id.toString().includes(searchTerm) ||
      o.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user_phone?.includes(searchTerm) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/orders/admin/orders/${orderId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading || !user || user.role === 'USER') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of APR Ocean Enterprise operations</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Package size={18} /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('ratings')}
              className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ratings' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Star size={18} /> Ratings
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <ShoppingBag size={18} /> Orders
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button 
              onClick={() => { setEditingProduct(null); setShowModal(true); }}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} /> Add Stock
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
           {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-[2rem]"></div>)}
           <div className="md:col-span-4 h-96 bg-gray-50 rounded-[2rem]"></div>
        </div>
      ) : data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Summary */}
          {activeTab === 'inventory' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Package size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Total Products</p><p className="text-2xl font-bold">{data.total_products}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl text-orange-500"><AlertTriangle size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Low Stock</p><p className="text-2xl font-bold">{data.low_stock_count}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-red-50 p-4 rounded-2xl text-red-500"><AlertTriangle size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Out of Stock</p><p className="text-2xl font-bold">{data.out_of_stock_count}</p></div>
              </div>
            </div>
          ) : activeTab === 'ratings' ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-500"><Star size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Overall Rating</p><p className="text-2xl font-bold">{data.overall_avg_rating} / 5</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><MessageSquare size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Recent Reviews</p><p className="text-2xl font-bold">{data.recent_reviews?.length || 0}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-4 rounded-2xl text-green-500"><TrendingUp size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Top Products</p><p className="text-2xl font-bold">4.8+</p></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary"><ShoppingBag size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Total Orders</p><p className="text-2xl font-bold">{data.total_orders}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl text-orange-500"><Clock size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Pending</p><p className="text-2xl font-bold">{data.pending_orders}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><Truck size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Shipped</p><p className="text-2xl font-bold">{data.shipped_orders}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-4 rounded-2xl text-green-500"><TrendingUp size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Revenue</p><p className="text-2xl font-bold">₹{data.total_revenue}</p></div>
              </div>
            </div>
          )}

          {/* Detailed View */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {activeTab === 'inventory' ? 'Stock Management' : 
                 activeTab === 'ratings' ? 'Recent Customer Reviews' : 'Order Management'}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 ring-primary outline-none" 
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  {activeTab === 'inventory' ? (
                    <tr>
                       <th className="px-8 py-4">Product Name</th>
                       <th className="px-8 py-4">Brand</th>
                       <th className="px-8 py-4">Current Stock</th>
                       <th className="px-8 py-4">Status</th>
                       <th className="px-8 py-4 text-center">Actions</th>
                    </tr>
                  ) : activeTab === 'ratings' ? (
                     <tr>
                       <th className="px-8 py-4">Customer</th>
                       <th className="px-8 py-4">Product</th>
                       <th className="px-8 py-4">Rating</th>
                       <th className="px-8 py-4">Comment</th>
                       <th className="px-8 py-4">Date</th>
                     </tr>
                   ) : (
                     <tr>
                       <th className="px-8 py-4">Order ID</th>
                       <th className="px-8 py-4">Customer</th>
                       <th className="px-8 py-4">Amount</th>
                       <th className="px-8 py-4">Method</th>
                       <th className="px-8 py-4">Delivery</th>
                       <th className="px-8 py-4">Status</th>
                       <th className="px-8 py-4 text-center">Actions</th>
                     </tr>
                   )}
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                   {activeTab === 'inventory' ? (
                     filteredInventory.map((p: any) => (
                       <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-8 py-4 font-bold text-gray-800">{p.name}</td>
                         <td className="px-8 py-4 text-gray-500">{p.brand}</td>
                         <td className="px-8 py-4 font-mono font-bold text-gray-900">{p.stock}</td>
                         <td className="px-8 py-4">
                           {p.stock === 0 ? (
                             <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">Out of Stock</span>
                           ) : p.stock <= 10 ? (
                             <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">Low Stock</span>
                           ) : (
                             <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">Optimal</span>
                           )}
                         </td>
                         <td className="px-8 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEdit(p.id)}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                         </td>
                       </tr>
                     ))
                   ) : activeTab === 'ratings' ? (
                     filteredReviews.map((r: any) => (
                       <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-8 py-4 font-bold text-primary">{r.user}</td>
                         <td className="px-8 py-4">{r.product}</td>
                         <td className="px-8 py-4">
                           <div className="flex items-center gap-1 text-yellow-500 font-bold">
                             <Star size={14} className="fill-current" /> {r.rating}
                           </div>
                         </td>
                         <td className="px-8 py-4 text-gray-500 italic max-w-xs truncate">"{r.comment}"</td>
                         <td className="px-8 py-4 text-gray-400 text-xs">{new Date(r.date).toLocaleDateString()}</td>
                       </tr>
                     ))
                   ) : (
                     filteredOrders.map((o: any) => (
                       <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-8 py-4 font-mono font-bold text-gray-900">#{o.id}</td>
                         <td className="px-8 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800">{o.user_full_name}</span>
                              <span className="text-xs text-gray-400">{o.user_phone}</span>
                            </div>
                         </td>
                         <td className="px-8 py-4 font-bold text-gray-900">₹{o.total_amount}</td>
                         <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${o.payment_method === 'ONLINE' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                              {o.payment_method}
                            </span>
                         </td>
                         <td className="px-8 py-4">
                            {o.address_details ? (
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-700">{o.address_details.city}</span>
                                <span className="text-[10px] text-gray-400">{o.address_details.pincode}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-red-400 italic">No Address</span>
                            )}
                         </td>
                         <td className="px-8 py-4">
                           <select 
                             value={o.status}
                             onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                             className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-none outline-none appearance-none cursor-pointer transition-all
                               ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 
                                 o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                                 o.status === 'PACKED' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}
                           >
                             <option value="PENDING">PENDING</option>
                             <option value="PACKED">PACKED</option>
                             <option value="SHIPPED">SHIPPED</option>
                             <option value="DELIVERED">DELIVERED</option>
                           </select>
                         </td>
                         <td className="px-8 py-4 text-center">
                            <button 
                              title="View Details"
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              onClick={() => setViewingOrder(o)}
                            >
                              <ClipboardList size={16} />
                            </button>
                         </td>
                       </tr>
                     ))
                   )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ProductModal 
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchData()}
        />
      )}

      {viewingOrder && (
        <OrderDetailModal 
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Package, Star, AlertTriangle, MessageSquare, BarChart3, TrendingUp, Search } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'ratings'>('inventory');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role === 'USER')) {
      router.push('/');
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'inventory' ? '/store/admin/inventory/' : '/store/admin/ratings/';
      const res = await apiFetch(endpoint);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'USER') fetchData();
  }, [activeTab, user]);

  if (authLoading || !user || user.role === 'USER') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of APR Osean Interprise operations</p>
        </div>
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
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-500"><Star size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Overall Rating</p><p className="text-2xl font-bold">{data.overall_avg_rating} / 5</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><MessageSquare size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Recent Reviews</p><p className="text-2xl font-bold">{data.recent_reviews.length}</p></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-green-50 p-4 rounded-2xl text-green-500"><TrendingUp size={24}/></div>
                <div><p className="text-xs text-gray-400 font-bold uppercase">Top Products</p><p className="text-2xl font-bold">4.8+</p></div>
              </div>
            </div>
          )}

          {/* Detailed View */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{activeTab === 'inventory' ? 'Stock Management' : 'Recent Customer Reviews'}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
                <input type="text" placeholder="Filter..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 ring-primary outline-none" />
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
                    </tr>
                  ) : (
                    <tr>
                       <th className="px-8 py-4">Customer</th>
                       <th className="px-8 py-4">Product</th>
                       <th className="px-8 py-4">Rating</th>
                       <th className="px-8 py-4">Comment</th>
                       <th className="px-8 py-4">Date</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                   {activeTab === 'inventory' ? (
                     data.products.map((p: any) => (
                       <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-8 py-4 font-bold">{p.name}</td>
                         <td className="px-8 py-4 text-gray-500">{p.brand}</td>
                         <td className="px-8 py-4 font-mono font-bold">{p.stock}</td>
                         <td className="px-8 py-4">
                           {p.stock === 0 ? (
                             <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">Out of Stock</span>
                           ) : p.stock <= 10 ? (
                             <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">Low Stock</span>
                           ) : (
                             <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">Optimal</span>
                           )}
                         </td>
                       </tr>
                     ))
                   ) : (
                     data.recent_reviews.map((r: any) => (
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
                   )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

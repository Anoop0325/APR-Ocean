'use client';
import { X, User, Phone, Mail, MapPin, Package, CreditCard, Clock } from 'lucide-react';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-7 bg-gray-50 border-b border-gray-100 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h2>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Order</span>
              <p className="text-sm text-gray-500 font-mono font-bold tracking-tighter">#{order.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-200 rounded-2xl transition-all text-gray-400 hover:text-red-500 shadow-sm active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Customer Info */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Customer Information
              </h3>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-5 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1.5">Full Name</p>
                    <p className="font-bold text-gray-800 leading-none">{order.user_full_name || order.user_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1.5">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-700 leading-none">{order.user_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1.5">Email Address</p>
                    <p className="text-sm font-semibold text-gray-700 leading-none break-all">{order.user_email || 'No email provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} /> Delivery Address
              </h3>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex-grow min-h-[200px] flex flex-col">
                {order.address_details ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="font-bold text-gray-800">{order.address_details.full_name}</p>
                       <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">Ship To</span>
                    </div>
                    <div className="h-px bg-gray-200/50 w-full"></div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {order.address_details.street_address},<br/>
                      {order.address_details.city}, {order.address_details.state}<br/>
                      <span className="text-gray-900 font-black mt-2 inline-block bg-white px-3 py-1 rounded-full border border-gray-100">PIN: {order.address_details.pincode}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-4">
                    <MapPin size={32} className="text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400 italic">No address details found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-10 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Package size={14} /> Order Items
            </h3>
            <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-7 py-4">Product</th>
                    <th className="px-7 py-4 text-center">Qty</th>
                    <th className="px-7 py-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {order.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-7 py-5 font-bold text-gray-800">{item.product_name}</td>
                      <td className="px-7 py-5 text-center">
                        <span className="bg-secondary text-primary px-3 py-1 rounded-xl font-black text-xs">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-7 py-5 text-right font-mono font-bold text-gray-700">₹{item.price_at_purchase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Meta */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2.5">Status</p>
               <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ring-1 ring-inset shadow-sm ${
                 order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 ring-green-100' : 
                 order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-blue-50 text-blue-700 ring-blue-100'
               }`}>
                 {order.status}
               </span>
             </div>
             <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2.5">Payment</p>
               <p className="text-[11px] font-black text-gray-700 uppercase tracking-tighter flex items-center gap-1.5">
                  <CreditCard size={12} className="text-gray-400" /> {order.payment_method}
               </p>
             </div>
             <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2.5">Date</p>
               <p className="text-[11px] font-black text-gray-700 tracking-widest flex items-center gap-1.5">
                  <Clock size={12} className="text-gray-400" /> {formatDate(order.created_at)}
               </p>
             </div>
             <div className="bg-white p-5 rounded-[1.5rem] border border-primary/20 shadow-lg ring-2 ring-primary/5">
               <p className="text-[10px] font-bold text-primary uppercase mb-2.5">Grand Total</p>
               <p className="text-xl font-black text-primary tracking-tighter">₹{order.total_amount}</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-xl hover:bg-primary-hover transition-all active:scale-95 shadow-primary/20"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

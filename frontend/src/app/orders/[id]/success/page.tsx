'use client';
import { API_URL } from '@/lib/api';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Download, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccess() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
         <CheckCircle2 className="text-primary" size={48} />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-10">Your order <span className="font-bold text-gray-900">#{id}</span> has been successfully placed and is being processed.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button 
           className="flex items-center justify-center gap-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
           onClick={() => window.open(`${API_URL}/orders/orders/${id}/invoice/`, '_blank')}
        >
          <Download className="text-primary group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <p className="text-xs text-gray-400 font-bold uppercase">Get Receipt</p>
            <p className="text-sm font-bold">Download Invoice</p>
          </div>
        </button>

        <Link 
          href="/products" 
          className="flex items-center justify-center gap-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
        >
          <Package className="text-primary group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <p className="text-xs text-gray-400 font-bold uppercase">Next Step</p>
            <p className="text-sm font-bold">Continue Shopping</p>
          </div>
        </Link>
      </div>

      <Link 
        href="/orders" 
        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
      >
        Track Order Progress <ArrowRight size={18} />
      </Link>
    </div>
  );
}

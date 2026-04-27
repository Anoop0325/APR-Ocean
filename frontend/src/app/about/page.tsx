'use client';
import Link from 'next/link';
import { Pill, ShieldCheck, Truck, Clock, Users, ArrowRight, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (Previous Home Content) */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-secondary/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Pill size={14} /> Trusted by 10,000+ Customers
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
              Your Health, Our <span className="text-primary italic">Priority</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              APR Ocean Enterprise provides authentic pharmaceutical products and healthcare supplies at your doorstep. We are committed to making healthcare accessible, affordable, and reliable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link href="/contact" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-95">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=2069" 
               alt="Pharmacy" 
               className="rounded-[3rem] shadow-2xl border-8 border-white"
             />
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">100% Authentic</p>
                  <p className="text-xs text-gray-500">Quality Verified</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-20 px-4 md:px-8 border-y border-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck />, label: 'Fast Delivery', sub: 'Within 24-48 Hours' },
            { icon: <ShieldCheck />, label: 'Genuine Products', sub: 'Direct from Brands' },
            { icon: <Clock />, label: '24/7 Support', sub: 'Always here to help' },
            { icon: <Users />, label: 'Happy Customers', sub: 'Verified Reviews' }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
            <p>
              Founded with a mission to bridge the gap between quality healthcare and accessibility, **APR Ocean Enterprise** has grown into a leading name in the pharmaceutical e-commerce space. We understand that health is the most valuable asset, and we treat it with the utmost care.
            </p>
            <p>
              Our journey started with a simple observation: getting authentic medicines shouldn't be a struggle. Today, we serve thousands of families, providing them with verified medical supplies, personal care products, and healthcare equipment from the world's most trusted brands.
            </p>
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 my-10">
              <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <Star className="text-yellow-500 fill-current" size={20} /> Why Choose Us?
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="flex items-center gap-2 text-sm font-medium">✓ Certified Pharmacists Verification</li>
                <li className="flex items-center gap-2 text-sm font-medium">✓ Secure & Temperature-Controlled Shipping</li>
                <li className="flex items-center gap-2 text-sm font-medium">✓ Competitive Pricing & Transparency</li>
                <li className="flex items-center gap-2 text-sm font-medium">✓ Easy Online Ordering & Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
             Ready to take control of your health?
           </h2>
           <p className="text-white/80 text-xl max-w-2xl mx-auto font-medium">
             Join thousands of satisfied customers who trust APR Ocean Enterprise for their medical needs.
           </p>
           <Link href="/" className="inline-flex bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl active:scale-95">
             Explore Our Products
           </Link>
        </div>
      </section>
    </div>
  );
}

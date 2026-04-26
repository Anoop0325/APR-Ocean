import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center px-4 md:px-8 overflow-hidden bg-secondary/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Genuine Medicines <br />
              <span className="text-primary">Delivered with Care.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              APR Osean Interprise provides authentic pharmaceutical products and healthcare supplies at your doorstep.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/20"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link 
                href="/about" 
                className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-bold hover:bg-primary/5 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-transform duration-500">
               {/* Note: In a real app we'd use a real image, using a placeholder for now */}
               <div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
                 Pharmacy <br/> Essentials
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-primary" size={32} />, title: "100% Authentic", desc: "Sourced directly from verified distributors and manufacturers." },
            { icon: <Truck className="text-primary" size={32} />, title: "Express Delivery", desc: "Get your medicines delivered within 24 hours in major cities." },
            { icon: <Clock className="text-primary" size={32} />, title: "24/7 Support", desc: "Expert pharmacists available on call for your concerns." },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 bg-secondary rounded-full">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="medical-gradient rounded-[2rem] p-8 md:p-16 text-white text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-3xl md:text-4xl font-bold relative z-10">Don&apos;t wait for your health.</h2>
          <p className="text-white/80 max-w-xl mx-auto relative z-10">
            Join thousands of satisfied customers who trust APR Osean Interprise for their medical needs.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-block bg-white text-primary px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all relative z-10 shadow-xl"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}

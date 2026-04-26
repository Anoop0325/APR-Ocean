import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-bold text-lg text-primary mb-4">APR Osean Interprise</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Leading pharmacy network providing authentic medicines and wellness products at your doorstep.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <p className="text-sm text-gray-600 mb-2">123 Health Street, Medical District</p>
          <p className="text-sm text-gray-600 mb-2">+91 98765 43210</p>
          <p className="text-sm text-gray-600">support@aprosean.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} APR Osean Interprise. All rights reserved.
      </div>
    </footer>
  );
}


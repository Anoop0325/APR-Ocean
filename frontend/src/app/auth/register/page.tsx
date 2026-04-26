'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Pill, Phone, Key, User, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (formData.pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    setLoading(true);
    
    const success = await register(
      formData.name,
      formData.phone,
      formData.pin,
      formData.email || undefined
    );

    if (success) {
      router.push('/');
    } else {
      setError('Registration failed. Phone number might already be registered.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Pill className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join APR Osean Interprise today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Full Name"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-primary transition-all outline-none"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Phone Number"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-primary transition-all outline-none"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email Address (Optional)"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-primary transition-all outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                  placeholder="4-Digit PIN"
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-primary transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
                  placeholder="Confirm PIN"
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

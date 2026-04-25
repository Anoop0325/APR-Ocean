'use client';
import { useState, useEffect, useRef } from 'react';
import { Product, Category } from '@/types';
import { apiFetch } from '@/lib/api';
import { X, Loader2, Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ProductModalProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ product, categories, onClose, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    mrp: '',
    discount_percent: '0',
    gst_percent: '12',
    stock: '0',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category.toString(),
        brand: product.brand || '',
        description: product.description,
        mrp: product.mrp,
        discount_percent: product.discount_percent,
        gst_percent: product.gst_percent,
        stock: product.stock.toString(),
      });
      if (product.image) setImagePreview(product.image);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = product ? `/store/admin/products/${product.id}/` : '/store/admin/products/';
      const method = product ? 'PATCH' : 'POST'; // Use PATCH for updates with images to be safer
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.append('image', imageFile);

      const res = await apiFetch(endpoint, {
        method,
        body: data,
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Upload Area */}
            <div className="w-full md:w-1/3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Product Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                       <Camera size={20} /> Change
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-300 mb-3 mx-auto w-fit group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Upload Image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>
            </div>

            {/* Main Details */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</label>
                    <input 
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Stock</label>
              <input 
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
              <textarea 
                required
                rows={1}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">MRP (Rs.)</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={formData.mrp}
                  onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discount (%)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GST (%)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.gst_percent}
                  onChange={(e) => setFormData({...formData, gst_percent: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 ring-primary outline-none" 
                />
              </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (product ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

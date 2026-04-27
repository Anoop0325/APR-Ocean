'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi, addressApi, API_URL } from '@/lib/api';
import { User, MapPin, Camera, Save, Plus, Trash2, Calendar, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  
  // Profile state
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        gender: user.gender || '',
        dob: user.dob || '',
      });
      if (user.profile_picture) {
        setPreviewUrl(user.profile_picture.startsWith('http') ? user.profile_picture : `${API_URL.replace('/api', '')}${user.profile_picture}`);
      }
      fetchAddresses();
      setLoading(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await addressApi.getAddresses();
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.gender) data.append('gender', formData.gender);
    if (formData.dob) data.append('dob', formData.dob);
    if (profilePic) data.append('profile_picture', profilePic);

    try {
      const res = await authApi.updateProfile(data);
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addressApi.addAddress(addressData);
      if (res.ok) {
        toast.success('Address added!');
        setShowAddressForm(false);
        setAddressData({
          full_name: '',
          street_address: '',
          city: '',
          state: '',
          pincode: '',
          is_default: false
        });
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await addressApi.deleteAddress(id);
      if (res.ok) {
        toast.success('Address removed');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to remove address');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'details' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <User size={18} />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'addresses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <MapPin size={18} />
              Saved Addresses
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {activeTab === 'details' ? (
                <div className="p-8">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center border-2 border-gray-100 group-hover:border-primary/50 transition-colors">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle size={48} className="text-gray-300" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                        <Camera size={16} className="text-primary" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setProfilePic(e.target.files[0]);
                              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Your Name'}</h2>
                      <p className="text-gray-500 text-sm">{user?.phone_number}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 focus:ring-2 ring-primary focus:bg-white outline-none transition-all text-sm"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-gray-100 border-gray-100 rounded-xl py-3 px-4 text-gray-500 text-sm cursor-not-allowed"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 ml-1">Email cannot be changed directly.</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 focus:ring-2 ring-primary focus:bg-white outline-none transition-all text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date of Birth</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                            className="w-full bg-gray-50 border-gray-100 rounded-xl py-3 px-4 focus:ring-2 ring-primary focus:bg-white outline-none transition-all text-sm appearance-none"
                          />
                          <Calendar size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Manage Addresses</h2>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="bg-secondary text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add New
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Receiver's Full Name"
                          className="w-full bg-white border-gray-100 rounded-xl py-2.5 px-4 text-sm"
                          value={addressData.full_name}
                          onChange={(e) => setAddressData({...addressData, full_name: e.target.value})}
                          required
                        />
                        <input
                          placeholder="Pincode"
                          className="w-full bg-white border-gray-100 rounded-xl py-2.5 px-4 text-sm"
                          value={addressData.pincode}
                          onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                          required
                        />
                        <input
                          placeholder="Street Address / House No."
                          className="w-full md:col-span-2 bg-white border-gray-100 rounded-xl py-2.5 px-4 text-sm"
                          value={addressData.street_address}
                          onChange={(e) => setAddressData({...addressData, street_address: e.target.value})}
                          required
                        />
                        <input
                          placeholder="City"
                          className="w-full bg-white border-gray-100 rounded-xl py-2.5 px-4 text-sm"
                          value={addressData.city}
                          onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                          required
                        />
                        <input
                          placeholder="State"
                          className="w-full bg-white border-gray-100 rounded-xl py-2.5 px-4 text-sm"
                          value={addressData.state}
                          onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button 
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 text-sm font-semibold text-gray-500"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No addresses saved yet.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className="group flex items-start justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
                          <div className="flex gap-4">
                            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                              <MapPin size={20} className="text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{addr.full_name}</h3>
                                {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {addr.street_address}, {addr.city}<br/>
                                {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

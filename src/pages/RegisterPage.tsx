import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Lock, Mail, User, Phone, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api'; 

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nic: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // අපි කලින් හදපු Laravel API එකට දත්ත යවනවා
      await api.post('/register', formData);
      alert('Account successfully created! Please log in.');
      navigate('/login'); // සාර්ථකව හැදුනම ආයෙත් Login පිටුවට යවනවා
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ─── PREMIUM BACKGROUND GLOWS ─── */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      {/* ─── REGISTER CARD ─── */}
      <div className="relative w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-500 z-10 my-8">
        
        <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm mb-5">
                <ShieldCheck size={32} className="text-indigo-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Create an Account</h1>
              <p className="text-sm font-medium text-slate-500">Join MotorShield LK today.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-4 py-3.5 outline-none font-medium placeholder:text-slate-400" />
                </div>
              </div>

              {/* NIC & Phone (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">NIC Number</label>
                  <div className="relative group">
                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required placeholder="123456789V" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-4 py-3.5 outline-none font-medium placeholder:text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0771234567" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-4 py-3.5 outline-none font-medium placeholder:text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-4 py-3.5 outline-none font-medium placeholder:text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-12 py-3.5 outline-none font-medium placeholder:text-slate-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-xl py-3.5 font-bold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 group"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
          
          {/* Back to Login Link */}
          <div className="bg-slate-50 border-t border-slate-100 py-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
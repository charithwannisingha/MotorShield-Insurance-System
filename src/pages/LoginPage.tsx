import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  // auth එකත් අලුතින් ගත්තා
  const { login, auth } = useApp();
  const navigate = useNavigate();
  
  // ── වෙනස 1: දැනටමත් ලොග් වෙලා නම්, ඉබේම ඇතුළට යවනවා ──
  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [auth?.isAuthenticated, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // බොරු ලෝඩින් වෙලාවක් (Premium feel එකක් දෙන්න)
    await new Promise(r => setTimeout(r, 800));
    
    const ok = await login(email, password);
    if (!ok) {
      setError('Invalid email or password. Please try again.');
    } else {
      // ── වෙනස 2: replace: true දැම්මම History එකෙන් ලොගින් පේජ් එක මැකෙනවා ──
      navigate('/app', { replace: true }); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ─── PREMIUM BACKGROUND GLOWS ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      {/* ─── LOGIN CARD ─── */}
      <div className="relative w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm mb-5">
                <ShieldCheck size={32} className="text-indigo-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
              <p className="text-sm font-medium text-slate-500">Please enter your details to sign in.</p>
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
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-4 py-3.5 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all pl-11 pr-12 py-3.5 outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-xl py-3.5 font-bold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Sign Up Link Section */}
          <div className="bg-slate-50 border-t border-slate-100 py-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs font-medium mt-6">
          © {new Date().getFullYear()} MotorShield LK. All rights reserved.
        </p>
      </div>

    </div>
  );
};
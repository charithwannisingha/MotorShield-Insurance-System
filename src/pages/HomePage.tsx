import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Car, 
  FileText, 
  Activity, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* ─── PREMIUM DARK NAVIGATION BAR ─── */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={22} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block leading-none mb-1">MotorShield</span>
                <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-[0.25em] block leading-none">Insurance Portal</span>
              </div>
            </div>
            
            {/* Right Nav */}
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-8">
                <a href="#vision" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Vision</a>
                <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Features</a>
              </div>
              <Link 
                to="/login" 
                className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
              >
                Sign In Portal
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION (DARK COLORFUL GRADIENT) ─── */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        {/* Colorful Gradients in Background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            THE NEXT GEN INSURANCE PLATFORM
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Intelligent Motor <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400">
              Insurance Management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Streamline your policy administration, accelerate claim processing, and deliver an unmatched digital experience to your customers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/25"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap justify-center gap-6 md:gap-12">
            {['Smart Claim Processing', 'End-to-end Encryption', 'Real-time Dashboard'].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <CheckCircle2 size={16} className="text-indigo-400" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISION & MISSION SECTION (LIGHT COLORED CARDS) ─── */}
      <section id="vision" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Vision */}
            <div className="bg-indigo-50/50 p-10 rounded-3xl shadow-sm border border-indigo-100 group hover:bg-indigo-50 transition-colors duration-300">
              <div className="w-14 h-14 bg-white border border-indigo-100 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-950 mb-4 tracking-tight">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                To be the most trusted and technologically advanced motor insurance platform in Sri Lanka, revolutionizing how vehicle owners interact with their insurance services seamlessly.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-blue-50/50 p-10 rounded-3xl shadow-sm border border-blue-100 group hover:bg-blue-50 transition-colors duration-300">
              <div className="w-14 h-14 bg-white border border-blue-100 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target size={24} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-950 mb-4 tracking-tight">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                To simplify and accelerate insurance management through innovative digital solutions, providing highly efficient services that empower our staff and delight our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID FEATURES SECTION (MIXED COLORS) ─── */}
      <section id="features" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Powerful features for <br className="hidden md:block"/> modern insurance.
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              Experience a fully computerized, automated approach to insurance administration designed to eliminate paperwork and reduce errors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Indigo Theme */}
            <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <FileText size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Policy Life-Cycle Management</h3>
                <p className="text-indigo-100 font-medium leading-relaxed max-w-md">
                  Create, manage, and renew motor insurance policies digitally. Automated reminders and seamless digital documentation with zero hassle.
                </p>
              </div>
            </div>

            {/* Feature 2 - Emerald Theme */}
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 hover:bg-emerald-100/50 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-200 flex items-center justify-center mb-6">
                <Activity size={22} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3 tracking-tight">Live Claim Tracking</h3>
              <p className="text-emerald-800/80 font-medium leading-relaxed">
                Submit claims instantly with photo uploads. Both admins and customers can track the approval status in real-time.
              </p>
            </div>

            {/* Feature 3 - Orange/Amber Theme */}
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 hover:bg-amber-100/50 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-200 flex items-center justify-center mb-6">
                <Car size={22} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-3 tracking-tight">Vehicle Registry</h3>
              <p className="text-amber-800/80 font-medium leading-relaxed">
                Maintain a centralized, accurate database of all registered customer vehicles and their associated risk profiles.
              </p>
            </div>

            {/* Feature 4 - Dark Slate Theme */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center mb-6">
                  <Users size={22} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Dedicated Access Portals</h3>
                <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                  Secure, role-based dashboards. Administrators get bird's-eye analytics, while customers enjoy a personalized view of their assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA SECTION ─── */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-400/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <ShieldCheck size={32} className="text-indigo-300" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to upgrade your experience?
          </h2>
          <p className="text-indigo-200 mb-10 text-lg max-w-2xl mx-auto font-medium">
            Join MotorShield LK today. Experience the ultimate security and speed of the next generation of motor insurance management.
          </p>
          
          <div className="flex justify-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-indigo-900 rounded-full font-bold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-xl shadow-black/20"
            >
              Access Secure Portal
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MINIMAL FOOTER ─── */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <span className="font-bold text-white tracking-tight">MotorShield</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} MotorShield LK. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
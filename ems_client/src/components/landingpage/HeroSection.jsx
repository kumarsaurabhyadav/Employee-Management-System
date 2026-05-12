import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 sm:pt-40 sm:pb-24 overflow-hidden">
      
      {/* Subtle Background Glow (Optional, for premium feel) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white/3 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-32 right-10 w-40 h-40 bg-white/3 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-52 h-52 bg-zinc-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10 animate-fade-in">
        
        {/* Top Badge */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase">
            ENTER-ACTIVE
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-[78px] font-bold text-white tracking-[-0.04em] leading-[0.95] mb-6">
          Employee <br className="hidden sm:block" />
          <span className="bg-linear-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Management System
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          Manage employees, payroll, attendance, tasks, and performance — all in one secure platform.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-24">
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started 
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto px-8 py-3.5 bg-white/3 text-white border border-white/10 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/20 backdrop-blur-md text-center"
          >
            View Features
          </a>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/10 pt-16">
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white/2 border border-white/5 rounded-2xl py-6 backdrop-blur-sm">
            <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">10K+</h3>
            <p className="text-sm text-zinc-500 font-medium">Active Users</p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white/2 border border-white/5 rounded-2xl py-6 backdrop-blur-sm">
            <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">500+</h3>
            <p className="text-sm text-zinc-500 font-medium">Companies</p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white/2 border border-white/5 rounded-2xl py-6 backdrop-blur-sm">
            <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">99.9%</h3>
            <p className="text-sm text-zinc-500 font-medium">Uptime</p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 bg-white/2 border border-white/5 rounded-2xl py-6 backdrop-blur-sm">
            <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">50+</h3>
            <p className="text-sm text-zinc-500 font-medium">Countries</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
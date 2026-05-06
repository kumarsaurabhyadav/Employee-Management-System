import React from 'react';

const LoginLeftSide = () => {
  return (
    <div className='hidden md:flex md:w-1/2 relative overflow-hidden bg-black border-r border-white/10 transition-all duration-500'>
      
      {/* Subtle Metallic/Silver Glows */}
      <div className='absolute top-[-10%] left-[-10%] w-125 h-125 bg-zinc-800/30 rounded-full blur-[120px] animate-pulse pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-zinc-700/20 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000'></div>

      {/* Ultra-Minimalist Dot Grid */}
      <div 
        className='absolute inset-0 z-0 opacity-30 pointer-events-none' 
        style={{ 
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>

      {/* Content Container */}
      <div className='relative z-10 flex flex-col items-start justify-center p-12 lg:p-24 w-full h-full'>
        
        {/* Sleek Monochrome Status Badge */}
        <div className='mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.03)] flex items-center gap-3'>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-300"></span>
          </span>
          <span className='text-xs font-semibold tracking-widest text-zinc-300 uppercase'>
            System Active
          </span>
        </div>

        {/* Silver/Titanium Gradient Heading */}
        <h1 className='text-5xl lg:text-7xl font-semibold mb-6 leading-tight tracking-tight drop-shadow-2xl'>
          <span className='text-white'>Employee</span> <br />
          <span className='bg-clip-text text-transparent bg-linear-to-r from-zinc-500 via-zinc-100 to-zinc-500'>
            Management System
          </span>
        </h1>
        
        <p className='text-zinc-400 text-lg lg:text-xl max-w-md leading-relaxed font-light'>
          Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
        </p>
      </div>

    </div>
  );
}

export default LoginLeftSide;
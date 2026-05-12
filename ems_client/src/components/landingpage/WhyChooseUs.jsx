import React from 'react';
import { ClockIcon, TrendingUpIcon, ShieldCheckIcon, BarChart3Icon, ArrowUpRightIcon } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: ClockIcon,
      title: "Save Time & Reduce Costs",
      description: "Automate repetitive HR tasks and reduce administrative overhead by up to 60%"
    },
    {
      icon: TrendingUpIcon,
      title: "Boost Productivity",
      description: "Empower employees with self-service tools and managers with real-time insights"
    },
    {
      icon: ShieldCheckIcon,
      title: "Stay Compliant",
      description: "Built-in compliance features ensure adherence to labor laws and regulations"
    },
    {
      icon: BarChart3Icon,
      title: "Data-Driven Decisions",
      description: "Advanced analytics and reporting help you make informed workforce decisions"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Side: Text and Benefits List */}
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-10">
              Why choose our platform?
            </h2>
            
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <benefit.icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Dashboard Mockup */}
          <div className="relative animate-slide-up">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-zinc-500/8 blur-[80px] rounded-full"></div>
            
            <div className="relative bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              {/* Total Employees Box */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-4 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-bold text-zinc-400">Total Employees</p>
                  <ArrowUpRightIcon className="w-4 h-4 text-zinc-300" />
                </div>
                <h4 className="text-4xl font-black text-white tracking-tight mb-2">5,284</h4>
                <p className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  ↑ 12% from last month
                </p>
              </div>

              {/* Present / Leave Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                  <p className="text-xs font-bold text-zinc-400 mb-2">Present Today</p>
                  <p className="text-2xl font-bold text-white">4,892</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                  <p className="text-xs font-bold text-zinc-400 mb-2">On Leave</p>
                  <p className="text-2xl font-bold text-white">392</p>
                </div>
              </div>

              {/* Attendance Progress Box */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                <p className="text-xs font-bold text-zinc-400 mb-4">Today's Attendance</p>
                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
                  {/* Progress Fill */}
                  <div className="w-[92%] h-full bg-white rounded-full"></div>
                </div>
                <p className="text-xs font-medium text-zinc-500">92% attendance rate</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
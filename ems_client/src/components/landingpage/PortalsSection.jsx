import React from 'react';
import { ShieldIcon, UserIcon, TargetIcon, CheckCircle2Icon } from 'lucide-react';

const PortalsSection = () => {
  // Teeno portals ka data
  const portals = [
    {
      title: "Admin Portal",
      icon: ShieldIcon,
      description: "Manage employees, configure system settings, generate reports, and oversee complete system configuration.",
      features: [
        "Full System Access",
        "User Management",
        "Advanced Analytics"
      ]
    },
    {
      title: "Manager Portal",
      icon: UserIcon,
      description: "Approve leave requests, monitor team attendance, review performance metrics, and access team reports.",
      features: [
        "Team Overview",
        "Approval Workflows",
        "Performance Tracking"
      ]
    },
    {
      title: "Employee Portal",
      icon: TargetIcon,
      description: "View your profile, track attendance, request leave, access payslips, and manage personal information.",
      features: [
        "Self-Service",
        "Leave Requests",
        "Attendance History"
      ]
    }
  ];

  return (
    <section className="relative py-16 sm:py-24 px-6 overflow-hidden border-t border-white/5 bg-[#0a0a0a]">

      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-112.5 h-112.5 bg-white/2 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-zinc-500/4 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.04em] leading-none mb-6">
            Multiple access portals
          </h2>
          <p className="text-sm sm:text-lg text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Dedicated dashboards and secure access for admins, managers, and employees.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {portals.map((portal, index) => (
            <div 
              key={index}
              className="group relative rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-white/1 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/4 flex flex-col"
            >

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl bg-white/1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon Box */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/4 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-white/8 transition-all duration-300">
                <portal.icon className="w-6 h-6 text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              </div>
              
              {/* Title & Description */}
              <h3 className="relative z-10 text-2xl font-bold text-white mb-4 tracking-tight">
                {portal.title}
              </h3>
              <p className="relative z-10 text-sm text-zinc-400 font-medium leading-relaxed mb-8 flex-1 transition-colors duration-300 group-hover:text-zinc-300">
                {portal.description}
              </p>
              
              {/* Green Checkmarks List */}
              <ul className="relative z-10 space-y-3">
                {portal.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PortalsSection;
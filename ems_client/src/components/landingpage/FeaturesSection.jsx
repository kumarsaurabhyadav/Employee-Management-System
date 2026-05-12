import React from 'react';
import {
  UsersIcon,
  CalendarIcon,
  WalletIcon,
  FileTextIcon,
  BarChart3Icon,
  ShieldCheckIcon
} from 'lucide-react';

const FeaturesSection = () => {

  const features = [
    {
      title: "Employee Management",
      description:
        "Centralized employee database with profiles, documents, and performance tracking.",
      icon: UsersIcon
    },
    {
      title: "Attendance Tracking",
      description:
        "Real-time attendance monitoring with automated reports and notifications.",
      icon: CalendarIcon
    },
    {
      title: "Payroll Processing",
      description:
        "Automated payroll calculations with tax compliance and direct deposits.",
      icon: WalletIcon
    },
    {
      title: "Leave Management",
      description:
        "Streamlined leave requests, approvals, and balance tracking system.",
      icon: FileTextIcon
    },
    {
      title: "Analytics & Reports",
      description:
        "Comprehensive insights with customizable dashboards and export options.",
      icon: BarChart3Icon
    },
    {
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with role-based access and audit trails.",
      icon: ShieldCheckIcon
    }
  ];

  return (
    <section
      id="features"
      className="relative py-16 sm:py-24 px-6 overflow-hidden"
    >

      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-125 h-125 bg-white/2 blur-3xl rounded-full pointer-events-none"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-zinc-500/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16 animate-fade-in">

          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/3 border border-white/10 text-xs text-zinc-300 font-medium mb-6 backdrop-blur-sm">
            FEATURES
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.04em] leading-none mb-6">
            Powerful features built
            <br className="hidden sm:block" />
            for modern teams
          </h2>

          <p className="text-sm sm:text-lg text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Manage employees, attendance, payroll, analytics, and security —
            all in one smart platform.
          </p>

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-white/1 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/4"
            >

              {/* Top Glow */}
              <div className="absolute inset-0 rounded-3xl bg-white/1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/4 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-white/8 transition-all duration-300">

                <feature.icon className="w-5 h-5 text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />

              </div>

              {/* Text */}
              <div className="relative z-10">

                <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-zinc-400 font-medium leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
                  {feature.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
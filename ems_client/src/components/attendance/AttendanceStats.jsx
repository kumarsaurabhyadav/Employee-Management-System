import React from "react";
import { AlertCircleIcon, CalendarIcon, ClockIcon } from "lucide-react";

const AttendanceStats = ({ history = [] }) => {
  const totalPresent = history.filter(
    (h) => h.status === "PRESENT" || h.status === "LATE"
  ).length;

  const totalLate = history.filter((h) => h.status === "LATE").length;

  const stats = [
    { label: "Days Present", value: totalPresent, icon: CalendarIcon },
    { label: "Late Arrivals", value: totalLate, icon: AlertCircleIcon },
    { label: "Avg. Work Hrs", value: "8.5 Hrs", icon: ClockIcon },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 animate-fade-in">
      {stats.map((s) => (
        <div
          key={s.label}
          className="card card-hover p-5 sm:p-6 flex items-center gap-5 relative overflow-hidden group"
        >
          {/* Sharp Black Left-Indicator on Hover */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-transparent group-hover:bg-black transition-colors duration-300" />

          {/* Icon Box: Light mode normally, Pure Black on hover (Inverse Effect) */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shadow-sm">
            <s.icon className="w-5.5 h-5.5" />
          </div>

          {/* Typography */}
          <div>
            <p className="text-[13px] font-semibold text-zinc-500 mb-0.5 tracking-wide">
                {s.label}
            </p>
            <h3 className="text-2xl font-bold text-black tracking-tight">
                {s.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStats;
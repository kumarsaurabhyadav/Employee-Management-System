import React from 'react';
import { 
  BookOpen, CheckCircle2, Award, Clock, 
  Users, BarChart3, Star, Target 
} from 'lucide-react';

const CourseStats = ({ role = 'admin' }) => {
  // 🚀 Logic: Role ke hisaab se stats decide honge
  const getStatsByRole = () => {
    switch (role) {
      case 'employee':
        return [
          { title: "Enrolled Courses", value: "3", subtitle: "Active now", icon: BookOpen, color: "text-blue-500" },
          { title: "Completed", value: "1", subtitle: "Finished", icon: CheckCircle2, color: "text-emerald-500" },
          { title: "Certificates", value: "1", subtitle: "Earned", icon: Award, color: "text-purple-500" },
          { title: "Learning Hours", value: "12.5", subtitle: "Time spent", icon: Clock, color: "text-orange-500" }
        ];
      case 'manager':
        return [
          { title: "Team Members", value: "12", subtitle: "Direct reports", icon: Users, color: "text-zinc-900" },
          { title: "Team Progress", value: "64%", subtitle: "Average", icon: Target, color: "text-zinc-900" },
          { title: "Pending Reviews", value: "5", subtitle: "Submissions", icon: Clock, color: "text-zinc-900" },
          { title: "Top Performance", value: "92%", subtitle: "Best score", icon: Star, color: "text-zinc-900" }
        ];
      default: // Admin
        return [
          { title: "Total Courses", value: "5", subtitle: "Active paths", icon: BookOpen, color: "text-zinc-900" },
          { title: "Total Employees", value: "787", subtitle: "Enrolled", icon: Users, color: "text-zinc-900" },
          { title: "Completion Rate", value: "78%", subtitle: "Overall", icon: BarChart3, color: "text-zinc-900" },
          { title: "Avg. Rating", value: "4.7", subtitle: "Feedback", icon: Star, color: "text-zinc-900" }
        ];
    }
  };

  const stats = getStatsByRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card card-hover p-6 relative overflow-hidden group flex items-start justify-between bg-white border border-zinc-200 shadow-sm rounded-xl transition-all duration-300"
        >
          {/* Left indicator: Only for Admin/Manager as per your previous style */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-transparent group-hover:bg-zinc-900 transition-colors duration-300" />

          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1.5">{stat.title}</p>
            {/* 🚀 Using text-zinc-900 for high contrast */}
            <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">{stat.value}</p>
            <p className="text-xs font-semibold text-zinc-400 mt-2 uppercase tracking-wider">{stat.subtitle}</p>
          </div>

          {/* 🚀 Icons: Colored for Employee to match image */}
          <div className={`p-3 rounded-xl bg-zinc-50 border border-zinc-100 ${stat.color} group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-300 shadow-sm`}>
            <stat.icon size={20} strokeWidth={2.2} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseStats;
import React, { useEffect, useState } from 'react';
import { 
  BookOpen, CheckCircle2, Award, Clock, 
  Users, BarChart3, Star, Target 
} from 'lucide-react';
import api from '../../api/axios';

const statsConfig = {
  employee: [
    { key: 'enrolledCourses', title: 'Enrolled Courses', subtitle: 'Active now', icon: BookOpen, color: 'text-blue-500' },
    { key: 'completedCourses', title: 'Completed', subtitle: 'Finished', icon: CheckCircle2, color: 'text-emerald-500' },
    { key: 'certificates', title: 'Certificates', subtitle: 'Earned', icon: Award, color: 'text-purple-500' },
    { key: 'learningHours', title: 'Learning Hours', subtitle: 'Time spent', icon: Clock, color: 'text-orange-500' },
  ],
  manager: [
    { key: 'teamMembers', title: 'Team Members', subtitle: 'Direct reports', icon: Users, color: 'text-zinc-900' },
    { key: 'teamProgress', title: 'Team Progress', subtitle: 'Average', icon: Target, color: 'text-zinc-900' },
    { key: 'pendingReviews', title: 'Pending Reviews', subtitle: 'Submissions', icon: Clock, color: 'text-zinc-900' },
    { key: 'topPerformance', title: 'Top Performance', subtitle: 'Best score', icon: Star, color: 'text-zinc-900' },
  ],
  admin: [
    { key: 'totalCourses', title: 'Total Courses', subtitle: 'Active paths', icon: BookOpen, color: 'text-zinc-900' },
    { key: 'totalEmployees', title: 'Total Employees', subtitle: 'Enrolled', icon: Users, color: 'text-zinc-900' },
    { key: 'completionRate', title: 'Completion Rate', subtitle: 'Overall', icon: BarChart3, color: 'text-zinc-900' },
    { key: 'avgRating', title: 'Avg. Rating', subtitle: 'Feedback', icon: Star, color: 'text-zinc-900' },
  ],
};

const CourseStats = ({ role = 'admin' }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const normalizedRole = String(role || 'admin').toLowerCase();
  const fallback = statsConfig[normalizedRole] || statsConfig.admin;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/courses/stats');
        if (Array.isArray(data.stats)) {
          const mappedStats = data.stats.map((item) => {
            const config = fallback.find((row) => row.key === item.key) || {};
            return {
              key: item.key || config.key,
              title: config.title || item.title || 'Stat',
              subtitle: config.subtitle || item.subtitle || '',
              icon: config.icon,
              color: config.color || 'text-zinc-900',
              value: item.value ?? config.value ?? '0',
            };
          });
          setStats(mappedStats.length ? mappedStats : fallback);
        } else {
          setStats(fallback);
        }
      } catch (err) {
        console.error('CourseStats fetch failed', err);
        setError('Unable to load stats');
        setStats(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = loading ? fallback : stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="card card-hover p-6 relative overflow-hidden group flex items-start justify-between bg-white border border-zinc-200 shadow-sm rounded-xl transition-all duration-300"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-transparent group-hover:bg-zinc-900 transition-colors duration-300" />

            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1.5">{stat.title}</p>
              <p className="text-3xl font-extrabold text-zinc-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-zinc-400 mt-2 uppercase tracking-wider">{stat.subtitle}</p>
            </div>

            <div className={`p-3 rounded-xl bg-zinc-50 border border-zinc-100 ${stat.color} group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-300 shadow-sm`}>
              {Icon ? <Icon size={20} strokeWidth={2.2} /> : null}
            </div>
          </div>
        );
      })}
      {error ? (
        <div className="col-span-full p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default CourseStats;
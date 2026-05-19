import React, { useEffect, useState } from 'react';
import { Trophy, Download, Award, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CompleteCourses = () => {
  const [completed, setCompleted] = useState([]);

  const recentCourse = completed
    .slice()
    .sort((a, b) => new Date(b.enrolledInfo?.completedAt).getTime() - new Date(a.enrolledInfo?.completedAt).getTime())[0];

  const load = async () => {
    try {
      const { data } = await api.get('/courses/my');
      setCompleted((data || []).filter((c) => c.enrolledInfo?.completed));
    } catch (error) {
      console.error('load completed failed', error);
      toast.error('Failed to load completed courses');
    }
  };

  const handleDownload = async (course) => {
    try {
      const resp = await api.get(`/courses/${course.id || course._id}/certificate`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${course.id || course._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded');
    } catch (error) {
      console.error('download failed', error);
      toast.error(error.response?.data?.error || 'Failed to download certificate');
    }
  };

  const handleRegenerate = async (course) => {
    try {
      await api.post(`/courses/${course.id || course._id}/certificate/regenerate`);
      toast.success('Certificate regenerated');
      load();
    } catch (error) {
      console.error('regenerate failed', error);
      toast.error(error.response?.data?.error || 'Failed to regenerate certificate');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mt-14 animate-fade-in">
      {recentCourse ? (
        <div className="mb-10 rounded-4xl border border-zinc-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-500 font-semibold mb-2">Recent certificate</p>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{recentCourse.title}</h2>
              <p className="text-sm text-zinc-500 mt-2">
                Completed on {new Date(recentCourse.enrolledInfo?.completedAt).toLocaleDateString()} • {recentCourse.category || 'Learning Path'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => handleDownload(recentCourse)}
                disabled={!recentCourse.enrolledInfo?.certificatePath}
                className={`btn-primary py-3 px-5 text-sm font-semibold ${!recentCourse.enrolledInfo?.certificatePath ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Download Certificate
              </button>
              <button
                onClick={() => handleRegenerate(recentCourse)}
                className="btn-secondary py-3 px-5 text-sm font-semibold"
              >
                Regenerate Certificate
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 🚀 Header: Title with "View All" Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Award size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            Completed Courses
          </h2>
        </div>
        
        <button className="btn-secondary py-2 px-4 flex items-center gap-2 text-xs font-bold transition-all hover:border-zinc-900">
          View All Certificates
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 🚀 Grid for Certificate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {completed.map((course) => (
          <div 
            key={course.id || course._id} 
            className="card card-hover flex flex-col group h-full transition-all duration-300"
          >
            {/* 🚀 Visual Header: Emerald/Green Trophy placeholder */}
            <div className="relative h-44 bg-emerald-50/50 flex items-center justify-center overflow-hidden border-b border-zinc-50">
              <div className="p-5 rounded-full bg-white shadow-sm border border-emerald-100 group-hover:scale-110 transition-transform duration-500">
                <Trophy className="text-emerald-500" size={40} strokeWidth={1.5} />
              </div>
              
              {/* Completed Badge */}
              <div className="absolute top-3 right-3">
                <span className="badge badge-success flex items-center gap-1 py-1 px-2.5 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle size={10} className="fill-emerald-600 text-white" />
                  Completed
                </span>
              </div>
            </div>

            {/* 🚀 Content Section */}
            <div className="p-5 flex flex-col grow">
              <h3 className="text-base font-black text-zinc-900 leading-tight mb-1 group-hover:text-black transition-colors">
                {course.title}
              </h3>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-tighter mb-5">
                By {course.createdBy?.email || 'Instructor'}
              </p>

              {/* Action Button: Matches btn-secondary for download */}
              <div className="mt-auto w-full grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleDownload(course)}
                  disabled={!course.enrolledInfo?.certificatePath}
                  className={`btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-zinc-900 font-bold text-xs hover:bg-zinc-900 hover:text-white hover:border-zinc-900 active:scale-95 transition-all ${!course.enrolledInfo?.certificatePath ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Download size={14} />
                  {course.enrolledInfo?.certificatePath ? 'Download Certificate' : 'Pending Certificate'}
                </button>
                <button onClick={() => handleRegenerate(course)} className="btn-primary w-full py-2.5 text-xs font-bold">Regenerate Certificate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Internal Helper for Badge Icon
const CheckCircle = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default CompleteCourses;
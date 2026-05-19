import React, { useEffect, useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Courses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: my }, { data: all }] = await Promise.all([
        api.get('/courses/my'),
        api.get('/courses')
      ]);

      const myIds = new Set(my.map((c) => c.id || c._id));
      setEnrolledCourses(my.map((c) => ({ ...c, progress: c.enrolledInfo?.progress || 0, accentColor: 'bg-blue-600' })));
      setAvailableCourses((all || []).filter((c) => !myIds.has(c.id || c._id)));
    } catch (error) {
      console.error('load courses failed', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEnroll = async (course) => {
    try {
      await api.post(`/courses/${course.id || course._id}/enroll`);
      toast.success('Enrolled successfully');
      load();
    } catch (error) {
      console.error('enroll failed', error);
      toast.error('Failed to enroll');
    }
  };

  const handlePrimaryAction = async (course) => {
    try {
      if (course.enrolledInfo?.completed) {
        await api.post(`/courses/${course.id || course._id}/certificate/regenerate`);
        toast.success('Certificate regenerated');
      } else {
        await api.post(`/courses/${course.id || course._id}/complete`);
        toast.success('Marked as complete');
      }
      load();
    } catch (error) {
      console.error('action failed', error);
      toast.error(error.response?.data?.error || 'Failed to update course');
    }
  };

  if (loading) return <div className="py-8">Loading courses...</div>;

  return (
    <div className="space-y-6 animate-fade-in pr-4">
      {enrolledCourses.map((course) => (
        <div 
          key={course.id || course._id} 
          className="card p-6 flex flex-col md:flex-row gap-8 group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
        >
          {/* 🚀 Visual Thumbnail Section */}
          <div className="relative w-full md:w-72 h-40 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shrink-0 overflow-hidden shadow-2xl shadow-zinc-200">
            {/* Play Button with Glassmorphism */}
            <div className="z-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-700">
              <Play className="text-white fill-white ml-1" size={24} />
            </div>
            
            {/* Dynamic Background Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-transparent to-white/5 opacity-40"></div>
          </div>

          {/* 🚀 Content & Intelligence Section */}
          <div className="flex-grow flex flex-col justify-between">
            <div className="relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-black transition-colors">
                  {course.title}
                </h3>
              </div>
              
              <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed italic">
                "{course.description}"
              </p>
              
              {/* Metadata with refined spacing */}
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <span className="bg-zinc-100 px-2 py-1 rounded-md text-zinc-600">By {course.createdBy?.email || 'Instructor'}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span>{course.videos} Videos</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span>{course.duration} Total</span>
              </div>
            </div>

            {/* 🚀 Interactive Progress Section */}
            <div className="mt-8 md:mt-0">
              <div className="flex items-end justify-between mb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block">Current Completion</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-900">{course.progress}</span>
                    <span className="text-sm font-bold text-zinc-400">%</span>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePrimaryAction(course)}
                    className="btn-secondary py-3 px-4 text-xs"
                  >
                    {course.enrolledInfo?.completed ? 'Regenerate' : 'Mark Complete'}
                  </button>
                  <button className="btn-primary py-3 px-8 gap-3 group/btn hover:shadow-zinc-300">
                    <span className="font-black tracking-widest text-[11px] uppercase">Continue</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Refined Progress Track */}
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${course.accentColor} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.2)]`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Available courses to enroll */}
      {availableCourses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Available Courses</h3>
          <div className="grid grid-cols-1 gap-4">
            {availableCourses.map((c) => (
              <div key={c.id || c._id} className="card p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">{c.title}</div>
                  <div className="text-xs text-zinc-500">{c.videos} videos • {c.duration}</div>
                </div>
                <button onClick={() => handleEnroll(c)} className="btn-primary px-4 py-2">Enroll</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

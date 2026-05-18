import React from 'react';
import { Play, Star, Video, Clock, Edit2, Trash2 } from 'lucide-react';

const CourseCard = ({ course, onEdit, onDelete }) => {
  return (
    /* 🚀 Standard Premium Size: Balanced height and clean layout */
    <div className="card card-hover overflow-hidden flex flex-col group h-full bg-white transition-all duration-300">
      
      {/* 🚀 Top Section: Height set to 46 for the perfect balance */}
      <div className="relative h-46 bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div className="z-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-all duration-500 cursor-pointer">
          <Play className="text-white fill-white ml-1" size={24} />
        </div>

        {/* Status Badge: Sharp Zinc Utility */}
        <div className="absolute top-3.5 right-3.5 z-20">
          <span className="badge badge-success px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {course.status || 'published'}
          </span>
        </div>

        {/* Category Label */}
        <div className="absolute bottom-3.5 left-3.5 z-20">
          <div className="bg-zinc-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              {course.category}
            </span>
          </div>
        </div>
      </div>

      {/* 🚀 Middle Section: Balanced padding p-5 */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-extrabold text-zinc-900 leading-tight mb-2 group-hover:text-black">
          {course.title}
        </h3>
        <p className="text-zinc-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed italic">
          "{course.description}"
        </p>

        {/* Rating & Learners */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">
            <Star className="text-amber-400 fill-amber-400" size={13} />
            <span className="text-xs font-bold text-zinc-900">{course.rating}</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {course.students} Learners
          </span>
        </div>

        {/* Metadata Footer: Zinc 900 highlights */}
        <div className="flex items-center gap-5 mt-auto border-t border-zinc-50 pt-4">
          <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-900 transition-colors">
            <Video size={13} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-tight">{course.videos} Videos</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-900 transition-colors">
            <Clock size={13} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-tight">{course.duration}</span>
          </div>
        </div>
      </div>

      {/* 🚀 Admin Actions: Premium Buttons */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <button className="flex-grow btn-secondary flex items-center justify-center gap-2 py-2.5 text-zinc-900 font-bold text-xs uppercase tracking-tight active:scale-[0.98]">
          <Play size={14} />
          Manage Videos
        </button>
        
        <button onClick={() => onEdit && onEdit(course)} className="p-2.5 rounded-xl border border-zinc-100 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-90">
          <Edit2 size={15} />
        </button>
        <button onClick={() => onDelete && onDelete(course)} className="p-2.5 rounded-xl border border-zinc-100 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
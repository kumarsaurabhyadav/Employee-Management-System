import React, { useState } from 'react';
import { 
  BookOpen, Tag, AlignLeft, Clock, Video, 
  Users, CheckCircle, Upload, Layers 
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CourseForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    duration: initialData?.duration || '',
    videos: initialData?.videos ? String(initialData.videos) : '',
    students: initialData?.students ? String(initialData.students) : '',
    status: initialData?.status || 'draft'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        videos: Number(formData.videos) || 0,
        students: Number(formData.students) || 0,
        status: formData.status,
      };

      let data;
      if (initialData && initialData.id) {
        const res = await api.put(`/courses/${initialData.id}`, payload);
        data = res.data;
        toast.success('Course updated successfully');
        const returned = data.course || data;
        // normalize id
        returned.id = returned.id || (returned._id ? String(returned._id) : undefined);
        if (onSuccess) onSuccess(returned);
      } else {
        const res = await api.post('/courses', payload);
        data = res.data;
        toast.success('Course created successfully');
        const returned = data.course || data;
        returned.id = returned.id || (returned._id ? String(returned._id) : undefined);
        if (onSuccess) onSuccess(returned);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-sm text-zinc-900 placeholder:text-zinc-400';

  const Label = ({ icon: Icon, children }) => (
    <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2.5'>
      <Icon size={14} strokeWidth={2.5} />
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-10 animate-slide-up pb-4'>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-zinc-900" />
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">General Details</h3>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className="space-y-1">
            <Label icon={BookOpen}>Course Title</Label>
            <input
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              placeholder='e.g. Employee Onboarding'
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label icon={Tag}>Category</Label>
            <input
              name='category'
              value={formData.category}
              onChange={handleChange}
              placeholder='e.g. Onboarding'
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label icon={AlignLeft}>Description</Label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows='3'
            placeholder='Briefly explain what this course covers...'
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="space-y-6 border-t border-zinc-100 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <Video size={18} className="text-zinc-900" />
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Content & Target</h3>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          <div className="space-y-1">
            <Label icon={Clock}>Duration</Label>
            <input
              name='duration'
              value={formData.duration}
              onChange={handleChange}
              placeholder='2h 30m'
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label icon={Video}>Videos</Label>
            <input
              name='videos'
              value={formData.videos}
              onChange={handleChange}
              placeholder='12'
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <Label icon={Users}>Students</Label>
            <input
              name='students'
              value={formData.students}
              onChange={handleChange}
              placeholder='145'
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
          <div className="space-y-1">
            <Label icon={Upload}>Thumbnail</Label>
            <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer group">
              <Upload size={20} className="text-zinc-300 group-hover:text-zinc-900 mb-1" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Upload Media</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label icon={CheckCircle}>Publishing Status</Label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
            </select>
          </div>
        </div>
      </div>

      <div className='flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 border-t border-zinc-100'>
        <button
          type='button'
          onClick={onCancel}
          disabled={saving}
          className='btn-secondary px-8 font-bold'
        >
          Discard
        </button>
        <button
          type='submit'
          disabled={saving}
          className='btn-primary px-10 font-black uppercase tracking-widest shadow-xl shadow-zinc-200'
        >
          {saving ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Course')}
        </button>
      </div>
    </form>
  )
}

export default CourseForm;

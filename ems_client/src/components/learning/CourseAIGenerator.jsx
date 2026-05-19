import React, { useState } from 'react';
import { Sparkles, FileText, Radio, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CourseAIGenerator = ({ onSuccess, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('slide');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please add a course topic or requirement.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/courses/generate-ai', {
        topic: prompt,
        requirement: prompt,
        type,
      });

      console.groupCollapsed('AI Course Generation Response');
      console.log('API response', data);
      console.log('Generated data payload', data.generated);
      console.log('Saved course document', data.savedCourse);
      console.groupEnd();

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate course');
      }

      const saved = data.savedCourse || data.generated || null;
      if (saved) {
        toast.success('Course generated successfully');
        onSuccess(saved);
      } else {
        toast.success('Course generated successfully');
        onSuccess(data.generated);
      }
    } catch (error) {
      console.error('AI generate error', error);
      toast.error(error.response?.data?.error || error.message || 'Course generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Sparkles size={18} className='text-emerald-700' />
          <h3 className='text-lg font-bold text-zinc-900'>AI-driven course generation</h3>
        </div>
        <p className='text-sm text-zinc-500'>Use a short topic description and the system will build a full course draft with slide-ready structure.</p>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-semibold text-zinc-700'>Course topic / requirement</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className='w-full rounded-3xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 resize-none'
          placeholder='e.g. Complete React.js course for beginners with projects and interview preparation'
        />
        <p className='text-xs text-zinc-500'>
          Describe what kind of course you want and AI will generate a structured learning roadmap.
        </p>
      </div>

      <div className='space-y-3'>
        <label className='block text-sm font-semibold text-zinc-700'>Course format</label>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <button
            type='button'
            onClick={() => setType('slide')}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all ${
              type === 'slide'
                ? 'border-black bg-black text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <FileText size={18} />
            <div>
              <p className='text-sm font-semibold'>Slide Based</p>
              <p className='text-xs opacity-80'>Presentation style learning course</p>
            </div>
          </button>

          <button
            type='button'
            onClick={() => setType('video')}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all ${
              type === 'video'
                ? 'border-black bg-black text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            <Radio size={18} />
            <div>
              <p className='text-sm font-semibold'>Video Based</p>
              <p className='text-xs opacity-80'>Video-focused AI generated course</p>
            </div>
          </button>
        </div>
      </div>

      <div className='flex items-center justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-2xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={loading}
          className='flex items-center gap-2 rounded-2xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 size={16} className='animate-spin' />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Course
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseAIGenerator;
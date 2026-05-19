import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import CourseStats from '../components/learning/CourseStats';
import CourseAIGenerator from '../components/learning/CourseAIGenerator';
import { Plus, Settings, Search, Video, X } from 'lucide-react';
import CourseCard from '../components/learning/CourseCard';
import CourseForm from '../components/learning/CourseForm';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminCourses = () => {
    const [loading, setLoading] = useState(true);
    const [showCreateModel, setShowCreateModel] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [query, setQuery] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const fetchCourses = async (q = '', showLoading = true) => {
        if (showLoading) setLoading(true);
        else setSearchLoading(true);
        try {
            const { data } = await api.get('/courses', { params: { q } });
            setCourses(data || []);
        } catch (error) {
            console.error('Fetch courses failed', error);
            toast.error(error.response?.data?.error || 'Unable to load courses');
        } finally {
            if (showLoading) setLoading(false);
            else setSearchLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // debounce search without showing global loader (prevents UI flicker)
    useEffect(() => {
        const t = setTimeout(() => fetchCourses(query, false), 400);
        return () => clearTimeout(t);
    }, [query]);

    const handleCourseCreated = (course) => {
        // ensure id present
        const courseId = course.id || course._id || (course._id && String(course._id));
        const normalized = { ...course, id: courseId };

        // if editing, replace
        if (editingCourse) {
            setCourses((prev) => prev.map((c) => {
                const cid = c.id || c._id;
                return String(cid) === String(courseId) ? normalized : c;
            }));
            setEditingCourse(null);
        } else {
            setCourses((prev) => [normalized, ...prev]);
        }
        setShowCreateModel(false);
        toast.success('Course saved successfully');
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowCreateModel(true);
    };

    const handleDelete = async (course) => {
        if (!confirm(`Delete course "${course.title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/courses/${course.id || course._id}`);
            setCourses((prev) => prev.filter((c) => c.id !== course.id && c._id !== course.id));
            toast.success('Course deleted');
        } catch (error) {
            console.error('Delete failed', error);
            toast.error(error.response?.data?.error || 'Failed to delete course');
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen animate-fade-in">

            {/* 🚀 Header Section: Title and Settings aligned in one row */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="page-title">
                        Course Management
                    </h1>
                    <p className="page-subtitle mt-1">
                        Create and monitor learning paths for your organization.
                    </p>
                </div>

                {/* Settings button now sits right across the title, near the bell icon area */}
                <Link
                    to="/admin/courses/settings"
                    className="btn-secondary flex items-center gap-2 px-4 py-2.5 mr-8"
                >
                    <Settings className="h-4 w-4  text-zinc-700" />
                    <span className="text-sm font-medium text-zinc-700">
                        Settings
                    </span>
                </Link>
            </div>

            <div className="min-h-screen animate-fade-in">

                {/* 🚀 Stats Cards Section */}
                <div className="mt-16">
                    <CourseStats />
                </div>

                <div className="flex items-center justify-between mt-10 mb-8 gap-6">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="card w-full py-3 pl-12 pr-12 text-sm outline-none transition-all"
                        />

                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                        {searchLoading ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-t-transparent border-zinc-700 rounded-full animate-spin" />
                            </div>
                        ) : null}
                    </div>

                    {/* Add Course Button */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="btn-secondary flex items-center gap-2 px-5 py-3 whitespace-nowrap"
                        >
                            <Video size={18} className="text-zinc-900" />
                            <span className="text-sm font-semibold tracking-tight text-zinc-900">
                                Generate Course
                            </span>
                        </button>
                        <button
                            onClick={() => { setEditingCourse(null); setShowCreateModel(true); }}
                            className="btn-primary flex items-center gap-2 px-5 py-3 whitespace-nowrap"
                        >
                            <Plus size={18} className="text-white" />
                            <span className="text-sm font-semibold tracking-tight">
                                Upload Course
                            </span>
                        </button>
                    </div>
                </div>

                {/* course card placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id || course._id} course={course} onEdit={() => handleEdit(course)} onDelete={() => handleDelete(course)} />
                    ))}
                </div>
            </div>

            {showGenerateModal && (
                <div
                    className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in'
                    onClick={() => setShowGenerateModal(false)}
                >
                    <div
                        className='relative bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-zinc-100 w-full max-w-3xl mb-8 animate-slide-up'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between p-6 sm:p-8 border-b border-zinc-100'>
                            <div>
                                <h2 className='text-2xl font-black text-zinc-900 tracking-tight'>Generate Course with AI</h2>
                                <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Give a short topic or requirement and let the system create a course draft.</p>
                            </div>
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className='p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900 border border-zinc-200'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        <div className='p-6 sm:p-8 bg-zinc-50/30 rounded-b-4xl'>
                            <CourseAIGenerator
                                onCancel={() => setShowGenerateModal(false)}
                                onSuccess={(course) => {
                                    handleCourseCreated(course);
                                    setShowGenerateModal(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showCreateModel && (
                <div
                    className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in'
                    onClick={() => setShowCreateModel(false)}
                >
                    <div
                        className='relative bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-zinc-100 w-full max-w-3xl mb-8 animate-slide-up'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between p-6 sm:p-8 border-b border-zinc-100'>
                            <div>
                                <h2 className='text-2xl font-black text-zinc-900 tracking-tight'>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                                    <p className='text-[13px] text-zinc-500 mt-1 font-medium'>{editingCourse ? 'Update course details and save changes.' : 'Create a new course and configure its learning details.'}</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModel(false)}
                                className='p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900 border border-zinc-200'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        <div className='p-6 sm:p-8 bg-zinc-50/30 rounded-b-4xl'>
                            <CourseForm
                                initialData={editingCourse}
                                onSuccess={handleCourseCreated}
                                onCancel={() => { setShowCreateModel(false); setEditingCourse(null); }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {courses.length === 0 && (
                <div className="card mt-16 border-dashed border-2 border-zinc-200 p-24 text-center bg-zinc-50/30 backdrop-blur-xl rounded-[3rem] animate-pulse">
                    {/* Minimalist Animated Icon Box */}
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-zinc-100 mx-auto flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Video className="text-zinc-300" size={32} strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
                        Ready to build the learning portal?
                    </h2>
                    <p className="text-zinc-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                        Your courses will appear here once you start creating content for your organization.
                    </p>

                    {/* Zinc 900 Accent Line */}
                    <div className="mt-8 flex justify-center gap-1">
                        <div className="w-12 h-1.5 bg-zinc-900 rounded-full"></div>
                        <div className="w-2 h-1.5 bg-zinc-200 rounded-full"></div>
                        <div className="w-2 h-1.5 bg-zinc-200 rounded-full"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
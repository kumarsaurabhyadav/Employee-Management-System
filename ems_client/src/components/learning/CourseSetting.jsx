import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Navigation ke liye
import Loading from '../Loading';
import { 
    Mail, Bell, Shield, Lock, Laptop, FileCheck, 
    Users, Download, ArrowLeft // 🚀 Back arrow icon
} from 'lucide-react';

const CourseSettings = () => {
    const navigate = useNavigate(); // 🚀 Navigation hook initialize kiya
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loading />;

    const SettingRow = ({ title, desc, icon: Icon }) => (
        <div className="flex items-center justify-between py-5 border-b border-zinc-100 last:border-0 group">
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-zinc-50 text-zinc-400 group-hover:text-zinc-900 transition-colors border border-zinc-100">
                    <Icon size={18} />
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-zinc-900">{title}</h4>
                    <p className="text-zinc-500 text-xs mt-1 font-medium">{desc}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900 shadow-sm"></div>
            </label>
        </div>
    );

    return (
        <div className="p-6 pt-0 min-h-screen bg-transparent animate-fade-in max-w-6xl mx-auto">
            
            {/* 🚀 Sleek Back Button */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)} // 🚀 Wapas pichle page par le jayega
                    className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-semibold text-sm"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </button>
            </div>

            {/* Page Header with Zinc 900 */}
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-none">
                    Settings
                </h1>
                <p className="text-zinc-500 text-sm mt-2 font-semibold">
                    Manage your course platform preferences and configurations.
                </p>
            </div>

            <div className="space-y-8">
                {/* 1. General Settings Section */}
                <div className="p-8 rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Laptop size={20} className="text-zinc-900" />
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">General Settings</h3>
                    </div>
                    <div className="space-y-1">
                        <SettingRow 
                            title="Course Completion Emails" 
                            desc="Send email notifications when courses are completed" 
                            icon={Mail}
                        />
                        <SettingRow 
                            title="Auto-Enroll New Employees" 
                            desc="Automatically enroll new employees in mandatory courses" 
                            icon={Users}
                        />
                        <SettingRow 
                            title="Certificate Generation" 
                            desc="Automatically generate certificates upon course completion" 
                            icon={FileCheck}
                        />
                    </div>
                </div>

                {/* 2. Notification Preferences Section */}
                <div className="p-8 rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Bell size={20} className="text-zinc-900" />
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Notification Preferences</h3>
                    </div>
                    <div className="space-y-1">
                        <SettingRow 
                            title="Email Notifications" 
                            desc="Receive email updates about courses and progress" 
                            icon={Mail}
                        />
                        <SettingRow 
                            title="New Course Announcements" 
                            desc="Notify when new courses are published" 
                            icon={Bell}
                        />
                        <SettingRow 
                            title="Progress Reminders" 
                            desc="Weekly reminders to continue incomplete courses" 
                            icon={Bell}
                        />
                    </div>
                </div>

                {/* 3. Security & Privacy Section */}
                <div className="p-8 rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield size={20} className="text-zinc-900" />
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Security & Privacy</h3>
                    </div>
                    <div className="space-y-1">
                        <SettingRow 
                            title="Course Access Restrictions" 
                            desc="Restrict course access based on department or role" 
                            icon={Lock}
                        />
                        <SettingRow 
                            title="Video Download Prevention" 
                            desc="Prevent unauthorized video downloads" 
                            icon={Download}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSettings;
import { Loader2, Save, User } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api/axios'

const ProfileForm = ({ initialData, onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("")
    setMessage("")

    const formData = new FormData(e.currentTarget)

    try {
        await api.post("/profile", formData)

        setMessage("Profile updated successfully")

        onSuccess?.()
    } catch (err) {
        setError(err.response?.data?.error || err.message);
    } finally {
        setLoading(false)
    }
}

    
    const inputBaseClass = "w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none";
    const disabledInputClass = `${inputBaseClass} bg-zinc-50 border-zinc-200 text-zinc-500 cursor-not-allowed`;
    const activeInputClass = `${inputBaseClass} bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50/50 focus:ring-1 focus:ring-black focus:border-black`;

    return (
        <form onSubmit={handleSubmit} className='bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8 mb-6 animate-fade-in'>
            
            {/* Premium Header */}
            <h2 className='text-lg font-bold text-zinc-900 tracking-tight mb-6 pb-5 border-b border-zinc-100 flex items-center gap-2.5'>
                <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                    <User className='w-4 h-4 text-zinc-600' />
                </div>
                Public Profile
            </h2>

            {/* Premium Error Alert */}
            {error && (
                <div className='bg-rose-50/50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3 animate-fade-in'>
                    <div className='w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]' />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Premium Success Alert */}
            {message && (
                <div className='bg-emerald-50/50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3 animate-fade-in'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]' />
                    <span className="font-medium">{message}</span>
                </div>
            )}

            <div className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    
                    {/* Name (Disabled) */}
                    <div>
                        <label className="block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1">
                            Name
                        </label>
                        <input
                            disabled
                            value={`${initialData.firstName} ${initialData.lastName}`}
                            className={disabledInputClass}
                        />
                    </div>

                    {/* Email (Disabled) */}
                    <div>
                        <label className="block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1">
                            Email
                        </label>
                        <input
                            disabled
                            value={initialData.email}
                            className={disabledInputClass}
                        />
                    </div>

                    {/* Position (Disabled) */}
                    <div className='sm:col-span-2'>
                        <label className="block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1">
                            Position
                        </label>
                        <input
                            disabled
                            value={initialData.position}
                            className={disabledInputClass}
                        />
                    </div>
                </div>

                {/* Bio (Editable unless deactivated) */}
                <div>
                    <label className="block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1">
                        Bio
                    </label>
                    <textarea
                        disabled={initialData.isDeleted}
                        name="bio"
                        defaultValue={initialData.bio || ""}
                        placeholder='Write a brief bio about yourself...'
                        rows={4}
                        className={`resize-none ${initialData.isDeleted ? disabledInputClass : activeInputClass}`}
                    />
                    <p className='text-[12px] font-medium text-zinc-400 mt-2 pl-1'>This will be displayed on your public profile.</p>
                </div>

                {/* Actions Container */}
                {initialData.isDeleted ? (
                    <div className='pt-4'>
                        <div className='p-5 bg-rose-50/50 border border-rose-200 rounded-xl flex flex-col items-center justify-center text-center'>
                            <p className='text-rose-600 font-bold uppercase tracking-widest text-[11px] mb-1'>Account Deactivated</p>
                            <p className='text-sm text-rose-500 font-medium'>You can no longer update your profile.</p>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-end pt-4 border-t border-zinc-100'>
                        <button 
                            type='submit' 
                            disabled={loading} 
                            className='w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-zinc-900 hover:bg-black border border-transparent shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0'
                        >
                            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}

            </div>
        </form>
    )
}

export default ProfileForm
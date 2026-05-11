import { CalendarDays, FileText, Loader2, Send, X } from 'lucide-react';
import React, { useState } from 'react'
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ApplyLeaveModel = ({ open, onClose, onSuccess }) => {

    const [loading, setLoading] = useState(false);

    const today = new Date();
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            await api.post('/leave', data)
            onSuccess()
            onClose()
        } catch (err) {
            toast.error(err.response?.data?.error || err?.message)
        }
    }

    if (!open) return null

    // Exact Premium Zinc/Black input style from our Employee Form
    const inputClass = "w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-black placeholder:text-zinc-400 hover:bg-zinc-50";

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity' onClick={onClose}>

            {/* Premium Slide-Up Container */}
            <div className='relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-200 w-full max-w-lg animate-slide-up' onClick={(e) => e.stopPropagation()}>

                {/* -------- Header --------- */}
                <div className='flex items-center justify-between p-6 border-b border-zinc-100'>
                    <div>
                        <h2 className='text-xl font-semibold text-black tracking-tight'>Apply for Leave</h2>
                        <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Submit your leave request for approval</p>
                    </div>
                    <button className='p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700' onClick={onClose}>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                
                {/* ------- Form ------- */}
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    
                    {/* ------ Leave Type ---- */}
                    <div>
                        <label className='flex items-center gap-2 mb-1.5 text-[13px] font-semibold text-zinc-700'>
                            <FileText className="w-4 h-4 text-zinc-400" />
                            Leave Type
                        </label>
                        <select name="type" required className={inputClass} defaultValue="">
                            <option value="" disabled>Select leave type</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="ANNUAL">Annual Leave</option>
                        </select>
                    </div>

                    {/* ------ Duration -------- */}
                    <div>
                        <label className='flex items-center gap-2 mb-1.5 text-[13px] font-semibold text-zinc-700'>
                            <CalendarDays className='w-4 h-4 text-zinc-400 '/>
                            Duration
                        </label>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <span className='block text-[12px] font-medium text-zinc-500 mb-1.5'>
                                From
                                </span>
                                <input type="date" name='startDate' required min={minDate} className={inputClass} />
                            </div>

                             <div>
                                <span className='block text-[12px] font-medium text-zinc-500 mb-1.5'>
                                To
                                </span>
                                <input type="date" name='endDate' required min={minDate} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* ---------- Reason ------ */}
                    <div>
                        <label className='block mb-1.5 text-[13px] font-semibold text-zinc-700'>
                            Reason
                        </label>
                        <textarea 
                            name="reason" 
                            required 
                            rows={3} 
                            className={`${inputClass} resize-none`} 
                            placeholder='Brief description of your leave reason...'
                        />
                    </div>

                    {/* --------- Buttons --------- */}
                    <div className='flex gap-3 pt-2'>
                        <button 
                            type='button' 
                            onClick={onClose}
                            className='flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-all'
                        >
                            Cancel
                        </button>

                        <button 
                            type='submit' 
                            disabled={loading}
                            className='flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-zinc-900 border border-transparent shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70'
                        >
                           {loading ? <Loader2 className='w-4 h-4 animate-spin'/> : <Send className='w-4 h-4 '/>}
                           {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ApplyLeaveModel
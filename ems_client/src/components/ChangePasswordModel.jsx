import { Loader2Icon, LockIcon, X } from 'lucide-react'
import React, { useState } from 'react'

const ChangePasswordModel = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setLoading(true)
        
        // Dummy API call
        setTimeout(() => {
            setLoading(false)
            onClose()
        }, 1500)
    }

    if (!open) return null

    // 🔥 Premium Input Styling
    const inputClass = "w-full px-4 py-3 bg-zinc-50/80 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-black placeholder:text-zinc-400 hover:bg-zinc-100/50";

    return (
        <div 
            onClick={!loading ? onClose : undefined}
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in'
        >
            
            {/* Premium Slide-Up Modal */}
            <div 
                className='relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-100 w-full max-w-md overflow-hidden animate-slide-up'
                onClick={(e) => e.stopPropagation()}
            >

                {/* -------- Header --------- */}
                <div className='flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white relative z-10'>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                            <LockIcon className="w-4 h-4 text-zinc-600" />
                        </div>
                        <h2 className='text-lg font-bold text-zinc-900 tracking-tight'>Change Password</h2>
                    </div>

                    <button onClick={onClose} disabled={loading} className='p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-800 disabled:opacity-50'>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-white'>
                    
                    {/* Alert Message with Premium Glow Effect */}
                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm flex items-start gap-3 animate-fade-in ${message.type === "success" ? "bg-emerald-50/50 text-emerald-700 border border-emerald-100" : "bg-rose-50/50 text-rose-700 border border-rose-100"}`}>
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${message.type === "success" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"}`} />
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Inputs */}
                    <div>
                        <label className='block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1'>
                            Current Password
                        </label>
                        <input type="password" name='currentPassword' required className={inputClass} placeholder="Enter current password" disabled={loading} />
                    </div>

                    <div>
                        <label className='block text-[12px] font-bold text-zinc-800 uppercase tracking-wide mb-2 pl-1'>
                            New Password
                        </label>
                        <input type="password" name='newPassword' required className={inputClass} placeholder="Create new password" disabled={loading} />
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3 pt-4 border-t border-zinc-100'>
                        <button type='button' onClick={onClose} disabled={loading} className='flex-1 px-4 py-3 rounded-xl text-sm font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-all disabled:opacity-50 disabled:hover:bg-white'>
                            Cancel
                        </button>
                        
                        {/* Signature Premium Black Bounce Button */}
                        <button type='submit' disabled={loading} className='flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-zinc-900 hover:bg-black border border-transparent shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:hover:translate-y-0'>
                            {loading && <Loader2Icon className='w-4 h-4 animate-spin'/>}
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModel
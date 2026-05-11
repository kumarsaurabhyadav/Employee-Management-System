import { Loader2Icon, LogIn, LogOut, CheckCircle2Icon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const CheckinButton = ({ todayRecord, onAction }) => {
    const [loading, setLoading] = useState(false)

    const handleAttendance = async () => {
        try {
            setLoading(true)

            await api.post("/attendance")
            await new Promise((resolve) => setTimeout(resolve, 1000))

            onAction()

        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message)
        } finally {
            setLoading(false)
        }
    }

    // 1. WORK DAY COMPLETED STATE 
    if(todayRecord?.checkOut){
        return(
            <div className='flex flex-col items-center justify-center p-8 mb-6 bg-white rounded-2xl border border-zinc-200 shadow-sm animate-fade-in'>
                
                {/* Sleek Success Icon */}
                <div className='w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4'>
                    <CheckCircle2Icon className='w-7 h-7 text-emerald-500' />
                </div>
                
                <h3 className='text-lg font-bold text-zinc-900 tracking-tight uppercase'>Day Completed</h3>
                <p className='text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1'>Great job! See you tomorrow</p>
            </div>
        )
    }

    const isCheckedIn = !!todayRecord?.checkIn;

  return (
    
    <div className='absolute bottom-6 right-6 z-50 flex flex-col animate-slide-up'>
        
        <button 
            onClick={handleAttendance} 
            disabled={loading} 
            className={`group relative w-65 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0
            ${isCheckedIn 
                ? "bg-white border border-zinc-200 text-black hover:border-red-300/40" // Check-Out: Sleek & Simple White Gray
                : "bg-black border border-black text-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]" // Check-In: Still bold black
            }`}
        >
            
            <div className='flex items-center gap-4 relative z-10'>
                
                {/* Icon Box with simple dynamic colors */}
                <div className={`p-3 rounded-xl shrink-0 transition-colors duration-300
                    ${isCheckedIn 
                        ? 'bg-zinc-100 text-zinc-600 group-hover:bg-red-50 group-hover:text-red-500' 
                        : 'bg-white/10 text-white' 
                    }`}
                >
                    {loading ? (
                        <Loader2Icon className='w-6 h-6 animate-spin'/>
                    ) : isCheckedIn ? (
                        <LogOut className='w-6 h-6 group-hover:-translate-x-0.5 transition-transform'/>
                    ) : (
                        <LogIn className='w-6 h-6 group-hover:translate-x-0.5 transition-transform' />
                    )}
                </div>

                {/* Typography details - Clean & Minimal */}
                <div className='text-left pr-4'>
                    <h2 className='text-[12px] font-bold tracking-widest uppercase mb-0.5'>
                        {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In" }
                    </h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest 
                        ${isCheckedIn ? "text-zinc-500" : "text-zinc-400"}`}>
                        {isCheckedIn ? "End shift" : "Start day"}
                    </p>
                </div>

            </div>
            
            {/* Subtle light reflection sweep effect on Check-in */}
            {!isCheckedIn && !loading && (
                <div className='absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]' />
            )}

        </button>

    </div>
  )
}

export default CheckinButton
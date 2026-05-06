import { Loader2Icon, LogIn, LogOut, CheckCircle2Icon } from 'lucide-react'
import React, { useState } from 'react'

const CheckinButton = ({todayRecord, onAction}) => {
    const [loading, setLoading] = useState(false)

    const handleAttendance = async () => {
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            onAction()
        },1000)
    }

    // 1. WORK DAY COMPLETED STATE 
    if(todayRecord?.checkOut){
        return(
            <div className='flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm animate-fade-in'>
                
                {/* Sleek Success Icon */}
                <div className='w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4'>
                    <CheckCircle2Icon className='w-7 h-7 text-emerald-500' />
                </div>
                
                <h3 className='text-lg font-bold text-zinc-900 tracking-tight'>Work Day Completed</h3>
                <p className='text-zinc-500 text-[13px] font-medium mt-1'>Great job today! See you tomorrow.</p>
            </div>
        )
    }

    const isCheckedIn = !!todayRecord?.isCheckedIn;

  return (
    
    <div className='absolute bottom-6 right-6 z-50 flex flex-col animate-slide-up'>
        
        <button 
            onClick={handleAttendance} 
            disabled={loading} 
            className={`group relative w-65 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0
            ${isCheckedIn 
                ? "bg-white border border-zinc-200 text-black hover:border-zinc-300" // Check-Out: Elegant White
                : "bg-black border border-black text-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]" // Check-In: Solid Premium Black
            }`}
        >
            
            <div className='flex items-center gap-4 relative z-10'>
                
                {/* Icon Box with dynamic colors */}
                <div className={`p-3 rounded-xl shrink-0 transition-colors duration-300
                    ${isCheckedIn 
                        ? 'bg-zinc-100 text-zinc-600 group-hover:bg-red-50 group-hover:text-red-500' // Red hover on clock out
                        : 'bg-white/10 text-white' // Subtle translucent box on black
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

                {/* Typography details */}
                <div className='text-left'>
                    <h2 className='text-[15px] font-bold tracking-tight mb-0.5'>
                        {loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In" }
                    </h2>
                    <p className={`text-[12px] font-medium 
                        ${isCheckedIn ? "text-zinc-500" : "text-zinc-400"}`}>
                        {isCheckedIn ? "End your current shift" : "Start your work day"}
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
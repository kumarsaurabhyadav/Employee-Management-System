import React from 'react'
import { LayoutGridIcon } from 'lucide-react'

const Loading = ({ embedded = false }) => {
  return (
    // Clean background matching your content area
    <div
      className={`flex flex-col items-center justify-center bg-white ${
        embedded ? "min-h-[50vh] py-16" : "min-h-screen"
      }`}
    >
        
        <div className='relative flex items-center justify-center'>
            {/* 1. Outer Sleek Spinning Ring */}
            <div className='w-12 h-12 border-[3px] border-zinc-100 border-t-black border-r-black/30 rounded-full animate-spin'></div>
            
            {/* 2. Inner Pulsing Brand Icon */}
            <div className='absolute inset-0 flex items-center justify-center'>
                <LayoutGridIcon className='w-4 h-4 text-zinc-300 animate-pulse' />
            </div>
        </div>

        {/* 3. Subtle Premium Typography */}
        <div className='mt-5 flex flex-col items-center'>
            <p className='text-[13px] font-semibold tracking-widest text-zinc-900 uppercase'>
                Workspace
            </p>
            <p className='text-xs font-medium text-zinc-500 mt-1 animate-pulse'>
                Loading your data...
            </p>
        </div>

    </div>
  )
}

export default Loading
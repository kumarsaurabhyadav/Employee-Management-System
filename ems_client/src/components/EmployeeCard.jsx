import { PencilIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import api from '../api/axios';
import toast from 'react-hot-toast';

const EmployeeCard = ({ employee, onDelete, onEdit, readOnly = false }) => {

    const handleDelete = async () => {
        if(!confirm ("Are you sure you want to delete this employee?"))
        return;
        try {
            await api.delete(`/employees/${employee.id}`)
            onDelete()
        } catch (err) {
            toast.error(err.response?.data?.error || err.message);
        }
    }

  return (
    <div className='group relative card card-hover overflow-hidden'>
        
        {/* Top Cover/Avatar Area - Sleek Zinc Gradient */}
        <div className='relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-zinc-100 to-zinc-50 border-b border-zinc-100'>
            <div className='w-full h-full flex items-center justify-center'>
                
                {/* Premium Avatar Circle */}
                <div className='w-20 h-20 rounded-full bg-white flex items-center justify-center border border-zinc-200 shadow-sm group-hover:scale-105 transition-transform duration-300'>
                    <span className='text-2xl font-bold text-zinc-700 tracking-tight'>
                        {employee.firstName[0]} {employee.lastName[0]}
                    </span>
                </div>
            </div>
        </div>

        {/* Top Left Badges */}
        <div className='absolute top-3 left-3 flex flex-wrap gap-2'>
            <span className='bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600 rounded-md shadow-sm border border-zinc-200/50'>
                {employee.department || "Remote"}
            </span>
            {employee.isDeleted && (
                <span className='bg-red-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-md shadow-sm'>
                    DELETED
                </span>
            )}
        </div>

        {/* Hover Action Buttons - NO BLACK OVERLAY, JUST FLOATING BUTTONS */}
        {!employee.isDeleted && !readOnly &&(
            // Pointer-events-none parent taaki hover interrupt na ho
            <div className='absolute inset-0 flex items-end justify-center pb-6 gap-3 pointer-events-none overflow-hidden'>
                
                {/* Edit Button - Slides up on hover */}
                <button 
                    onClick={()=>onEdit(employee)} 
                    className='pointer-events-auto opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 p-3 bg-white text-zinc-700 hover:text-black hover:scale-110 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-zinc-200 transition-all duration-300 ease-out'
                >
                    <PencilIcon className='w-4 h-4'/>
                </button>
                
                {/* Delete Button - Slides up with a tiny delay for that premium staggered effect */}
                <button 
                    onClick={handleDelete} 
                    className='pointer-events-auto opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 p-3 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 hover:scale-110 disabled:opacity-50 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-zinc-200 transition-all duration-300 ease-out delay-75'
                >
                    <Trash2Icon className='w-4 h-4 '/>
                </button>

            </div>
        )}

        {/* Text Details Area */}
        <div className='p-5 text-center sm:text-left'>
            <h3 className='text-base font-semibold text-zinc-900 tracking-tight'>
                {employee.firstName} {employee.lastName}
            </h3>
            <p className='text-[13px] font-medium text-zinc-500 mt-0.5'>
                {employee.position}
            </p>
        </div>
    </div>
  )
}

export default EmployeeCard
import { Calculator, CalendarDays, DollarSign, Plus, User, X, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

const GeneratePayslipForm = ({ employees = [], onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Trigger Button
    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className='bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-sm w-full sm:w-auto justify-center'
        >
            <Plus className='w-4 h-4' />
            Generate Payslip
        </button>
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Button ke andar spinner ghoomega
        setLoading(true);
        
        // Dummy API call (Yahan actual API ayegi)
        setTimeout(() => {
            setLoading(false);
            if (onSuccess) onSuccess();
            setIsOpen(false);
        }, 1500);
    }

    // Shared Premium Input Class
    const inputClass = "w-full px-4 py-3 bg-zinc-50/80 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-black placeholder:text-zinc-400 hover:bg-zinc-100/50 disabled:opacity-60 disabled:cursor-not-allowed";

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in' onClick={!loading ? () => setIsOpen(false) : undefined}>
            
            {/* Premium Slide-Up Form Container */}
            <div className='relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-100 w-full max-w-lg overflow-hidden animate-slide-up' onClick={(e) => e.stopPropagation()}>
                
                {/* -------- Header --------- */}
                <div className='flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white relative z-10'>
                    <div>
                        <h3 className='text-xl font-bold text-zinc-900 tracking-tight'>Generate Payslip</h3>
                        <p className='text-[13px] text-zinc-500 mt-0.5 font-medium'>Create a new monthly payslip record</p>
                    </div>
                    {/* Close button disabled while loading */}
                    <button onClick={() => setIsOpen(false)} disabled={loading} className='p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-800 disabled:opacity-50'>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-white'>
                    
                    {/* select employee */}
                    <div>
                        <label htmlFor="employeeId" className='flex items-center gap-2 mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide'>
                            <User className="w-4 h-4 text-zinc-400" /> Employee
                        </label>
                        <select id="employeeId" name="employeeId" required className={inputClass} defaultValue="" disabled={loading}>
                            <option value="" disabled>Select Employee</option>
                            {employees?.map((e) => (
                                <option key={e._id} value={e.employee?._id}>
                                    {e.employee?.firstName} {e.employee?.lastName} - {e.employee?.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* select month & year */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide">
                                <CalendarDays className="w-4 h-4 text-zinc-400" /> Month
                            </label>
                            <select name="month" className={inputClass} disabled={loading}>
                                {months.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide pl-6">
                                Year
                            </label>
                            <input type="number" name='year' defaultValue={new Date().getFullYear()} className={inputClass} required disabled={loading}/>
                        </div>
                    </div>

                    {/* basic salary */}
                    <div>
                        <label className="flex items-center gap-2 mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide">
                            <DollarSign className="w-4 h-4 text-zinc-400" /> Basic Salary
                        </label>
                        <input type="number" name='basicSalary' placeholder='e.g. 500000' className={inputClass} required disabled={loading}/>
                    </div>

                    {/* allowance & deductions */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide">
                                <Calculator className="w-4 h-4 text-zinc-400" /> Allowance
                            </label>
                            <input type="number" name='allowance' defaultValue='0' className={inputClass} disabled={loading}/>
                        </div>

                        <div>
                            <label className="block mb-2 text-[12px] font-bold text-zinc-800 uppercase tracking-wide pl-6">
                                Deductions
                            </label>
                            <input type="number" name='deductions' defaultValue='0' className={inputClass} disabled={loading}/>
                        </div>
                    </div>

                    {/* buttons */}
                    <div className='flex gap-3 pt-4 border-t border-zinc-100'>
                        <button onClick={() => setIsOpen(false)} disabled={loading} type="button" className='flex-1 px-4 py-3 rounded-xl text-sm font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-all disabled:opacity-50 disabled:hover:bg-white'>
                            Cancel
                        </button>

                        {/* 🚀 EXACT BUTTON LOADER LOGIC */}
                        <button disabled={loading} type="submit" className='flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-zinc-900 hover:bg-black border border-transparent shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:hover:translate-y-0'>
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Generating..." : "Generate Payslip"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GeneratePayslipForm
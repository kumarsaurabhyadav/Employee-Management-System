import { format } from 'date-fns'
import { Download } from 'lucide-react'
import React from 'react'

const PayslipList = ({ payslips, isAdmin }) => {
    
    // 🚀 THE FIX: Sirf un payslips ko rakho jisme actual data (year & month) hai. Khali (Ghost) objects ko hata do.
    const validPayslips = payslips?.filter(payslip => payslip && payslip.year && payslip.month) || [];

    return (
        <div className="w-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm animate-fade-in">
            
            {/* Theme Matching Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900">Payslip Records</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-md">
                    {validPayslips.length} RECORDS
                </span>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr>
                            {isAdmin && <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 w-[25%]">Employee</th>}
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[20%]' : 'w-[25%]'}`}>Period</th>
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[20%]' : 'w-[25%]'}`}>Basic Salary</th>
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[20%]' : 'w-[25%]'}`}>Net Salary</th>
                            <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 text-center w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {/* 🚀 Yahan humne updated 'validPayslips' use kiya hai */}
                        {validPayslips.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-16 text-center">
                                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No payslips found</p>
                                </td>
                            </tr>
                        ) : (
                            validPayslips.map((payslip) => (
                                <tr key={payslip._id || payslip.id} className="hover:bg-zinc-50 transition-colors group">
                                    
                                    {isAdmin && <td className="px-6 py-5 text-sm font-bold text-zinc-900 truncate">{payslip.employee?.firstName} {payslip.employee?.lastName}</td>}
                                    
                                    <td className="px-6 py-5">
                                        <span className="inline-flex px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-bold uppercase tracking-wider rounded-md">
                                            {format(new Date(payslip.year, payslip.month - 1), "MMM yyyy")}
                                        </span>
                                    </td>
                                    
                                    <td className="px-6 py-5 text-sm font-semibold text-zinc-500 truncate">${(payslip.basicSalary || 0).toLocaleString()}</td>
                                    
                                    <td className="px-6 py-5 text-sm font-bold text-zinc-900 truncate">${(payslip.netSalary || 0).toLocaleString()}</td>
                                    
                                    <td className="px-6 py-5 text-center">
                                        <button 
                                            onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`)} 
                                            className="group/btn inline-flex items-center justify-center px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg text-zinc-700 bg-white border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <Download className="w-3.5 h-3.5 mr-2 group-hover/btn:-translate-y-0.5 transition-transform duration-300" /> 
                                            Download
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PayslipList
import { format } from 'date-fns'
import { Check, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
    const [processing, setProcessing] = useState(null)

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id)
        try {
            await api.patch(`/leave/${id}`, {status})
            onUpdate()
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message)
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className="w-full bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900">Leave Applications</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-md">{leaves.length} RECORDS</span>
            </div>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr>
                            {isAdmin && <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 w-[15%]">Employee</th>}
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[10%]' : 'w-[15%]'}`}>Type</th>
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[25%]' : 'w-[30%]'}`}>Date</th>
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[20%]' : 'w-[40%]'}`}>Reason</th>
                            <th className={`px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 ${isAdmin ? 'w-[15%]' : 'w-[15%]'}`}>Status</th>
                            {isAdmin && <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 text-center w-[15%]">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-sm font-bold text-zinc-400">No records found</td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr key={leave._id || leave.id} className="hover:bg-zinc-50 transition-colors group">
                                    {isAdmin && <td className="px-6 py-5 text-sm font-bold text-zinc-900 truncate">{leave.employee?.firstName} {leave.employee?.lastName}</td>}
                                    <td className="px-6 py-5"><span className="inline-flex px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-bold uppercase tracking-wider rounded-md">{leave.type}</span></td>
                                    <td className="px-6 py-5 text-sm font-bold text-zinc-900 truncate">{format(new Date(leave.startDate), "dd MMM, yyyy")} - {format(new Date(leave.endDate), "dd MMM, yyyy")}</td>
                                    <td className="px-6 py-5 text-sm font-semibold text-zinc-500 truncate" title={leave.reason}>{leave.reason}</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border ${leave.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : leave.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{leave.status}</span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-5 text-center">
                                            {leave.status === "PENDING" ? (
                                                <div className="flex justify-center gap-2">
                                                    {/* Approve Button (Inverse Emerald Hover) */}
                                                    <button onClick={() => handleStatusUpdate(leave._id || leave.id, "APPROVED")} disabled={!!processing} className="group/approve p-2 rounded-lg text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-emerald-600">
                                                        {processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 group-hover/approve:-translate-y-0.5 transition-transform duration-300" />}
                                                    </button>
                                                    
                                                    {/* Reject Button (Inverse Rose Hover) */}
                                                    <button onClick={() => handleStatusUpdate(leave._id || leave.id, "REJECTED")} disabled={!!processing} className="group/reject p-2 rounded-lg text-rose-600 bg-white border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-rose-600">
                                                        {processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 group-hover/reject:-translate-y-0.5 transition-transform duration-300" />}
                                                    </button>
                                                </div>
                                            ) : <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Processed</span>}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaveHistory
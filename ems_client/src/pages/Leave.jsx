import React, { useCallback, useEffect, useState } from 'react'
import { dummyLeaveData } from '../assets/assets'
import Loading from '../components/Loading'
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react'
import LeaveHistory from '../components/leave/LeaveHistory'
import ApplyLeaveModel from '../components/leave/ApplyLeaveModel'

const Leave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = false;

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  if (loading) return <Loading />

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveStats = [
    { label: "Sick Leave", value: sickCount, icon: ThermometerIcon },
    { label: "Casual Leave", value: casualCount, icon: UmbrellaIcon },
    { label: "Annual Leave", value: annualCount, icon: PalmtreeIcon },
  ]

  return (
    <div className='animate-fade-in'>
      
      {/* Premium Zinc Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leave Management</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">{!isAdmin ? 'Manage leave applications' : 'Your leave history and requests'}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModal(true)} className='bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto justify-center shadow-sm'>
            <PlusIcon className='w-4 h-4' /> Apply for Leave
          </button>
        )}
      </div>

      {/* Premium Stats Cards - Exact Zinc Theme Match */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {leaveStats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex items-center gap-5 relative overflow-hidden group hover:border-zinc-300 transition-all duration-200 shadow-sm hover:shadow-md">
              
              {/* Subtle left border line that turns black on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-zinc-900 transition-colors duration-300" />

              {/* Icon Box: Inverse hover effect (Light to Zinc/Black) */}
              <div className='p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 shadow-sm'>
                <s.icon className='w-5 h-5' />
              </div>
              
              <div>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{s.label}</p>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight flex items-baseline gap-1.5">
                  {s.value} <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Taken</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave History Table Component */}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves}/>
      
      {/* Premium Slide-Up Modal */}
      <ApplyLeaveModel open={showModal} onClose={()=> setShowModal(false)} onSuccess={fetchLeaves}/>

    </div>
  )
}

export default Leave
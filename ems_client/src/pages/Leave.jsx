import React, { useCallback, useEffect, useState } from 'react'
import { dummyLeaveData } from '../assets/assets'
import Loading from '../components/Loading'
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react'
import LeaveHistory from '../components/leave/LeaveHistory'
import ApplyLeaveModel from '../components/leave/ApplyLeaveModel'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { withMinLoader } from '../utils/loaderDelay'

const Leave = () => {
  const {user} = useAuth()
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false);
  const [balance, setBalance] = useState(null);
  const isApprover = user?.role === "ADMIN" || user?.role === "MANAGER";
  const isEmployeeOnly = user?.role === "EMPLOYEE";

  const fetchLeaves = useCallback(async () => {
    try {
        setLoading(true)

        const res = await withMinLoader(async () => {
          const leaveRes = await api.get('/leave')
          let balanceData = null
          if (isEmployeeOnly) {
            try {
              const bal = await api.get("/leave/balance")
              balanceData = bal.data?.data || null
            } catch {
              balanceData = null
            }
          }
          return { leaveRes, balanceData }
        })

        setLeaves(res.leaveRes.data.data || [])
        setBalance(isEmployeeOnly ? res.balanceData : null)

        if (res.leaveRes.data.employee?.isDeleted) {
            setIsDeleted(true)
        } else {
            setIsDeleted(false)
        }

    } catch (error) {
        toast.error(error?.response?.data?.error || error.message)

    } finally {
        setLoading(false)
    }

}, [isEmployeeOnly])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  if (loading) return <Loading />

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveStats = [
    { label: "Sick Leave", value: balance?.sick ?? sickCount, icon: ThermometerIcon, suffix: "Left" },
    { label: "Casual Leave", value: balance?.casual ?? casualCount, icon: UmbrellaIcon, suffix: "Left" },
    { label: "Annual Leave", value: balance?.annual ?? annualCount, icon: PalmtreeIcon, suffix: "Left" },
  ]

  const subtitle = isApprover
    ? "Review and approve team leave requests"
    : "Manage your leave balance and applications";

  return (
    <div className='animate-fade-in'>
      
      {/* Premium Zinc Header */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 w-full'>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leave Management</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">{subtitle}</p>
        </div>
        {isEmployeeOnly && !isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className='bg-zinc-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg w-full sm:w-auto justify-center shadow-sm shrink-0 mr-14'
          >
            <PlusIcon className='w-4 h-4' /> Apply for Leave
          </button>
        )}
      </div>

      {/* Premium Stats Cards - Exact Zinc Theme Match */}
      {isEmployeeOnly && (
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
                  {s.value} <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.suffix}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave History Table Component */}
      <LeaveHistory leaves={leaves} isAdmin={isApprover} onUpdate={fetchLeaves}/>
      
      {/* Premium Slide-Up Modal */}
      <ApplyLeaveModel open={showModal} onClose={()=> setShowModal(false)} onSuccess={fetchLeaves}/>

    </div>
  )
}

export default Leave
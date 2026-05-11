import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { AlertCircleIcon } from 'lucide-react'
import CheckinButton from '../components/attendance/CheckinButton'
import AttendanceStats from '../components/attendance/AttendanceStats'
import AttendanceHistory from '../components/attendance/AttendanceHistory'
import RequestCorrectionModal from '../components/attendance/RequestCorrectionModal'
import api from '../api/axios'
import {toast} from 'react-hot-toast'
import { withMinLoader } from '../utils/loaderDelay'
import { localDateKey } from '../utils/dateKey'

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const [shiftPolicy, setShiftPolicy] = useState(null)
  const [readOnly, setReadOnly] = useState(false)
  const [correctionByDate, setCorrectionByDate] = useState({})
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [correctionRecord, setCorrectionRecord] = useState(null)

  const fetchData = useCallback(async () => {
  setLoading(true)

  try {
    const json = await withMinLoader(async () => {
      const res = await api.get("/attendance")
      return res.data
    })

    setHistory(json.data || [])
    setShiftPolicy(json.shiftPolicy || null)
    setReadOnly(Boolean(json.readOnly))

    try {
      const correctionRes = await api.get("/corrections?mine=1")
      const list = Array.isArray(correctionRes.data?.data) ? correctionRes.data.data : []
      const byKey = {}
      for (const r of list) {
        const key = localDateKey(r.date)
        if (!key) continue
        if (!byKey[key]) byKey[key] = { status: r.status }
      }
      setCorrectionByDate(byKey)
    } catch {
      setCorrectionByDate({})
    }

    if (json.employee?.isDeleted) {
      setIsDeleted(true)
    } else {
      setIsDeleted(false)
    }

  } catch (error) {
    toast.error(error?.response?.data?.error || error?.message)
  } finally {
    setLoading(false)
  }
}, [])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  if (loading) {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <Loading />
    </div>
  )
}

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecord = history.find((r)=> new Date(r.date).toDateString() === today.toDateString())
  const formatMinutes = (m) => {
    if (typeof m !== "number") return "—"
    const hh = String(Math.floor(m / 60)).padStart(2, "0")
    const mm = String(m % 60).padStart(2, "0")
    return `${hh}:${mm}`
  }

  return (
    <div className='animate-fade-in'>
      
      {/* Page Header */}
      <div className='page-header'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle'>Track your work hours and daily check-ins</p>
      </div>

      {shiftPolicy && (
        <div className="mb-6 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
            Your shift policy
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-700">
            <span>
              <span className="font-semibold text-zinc-900">Start:</span>{" "}
              {formatMinutes(shiftPolicy.shiftStartMinutes)}
            </span>
            <span>
              <span className="font-semibold text-zinc-900">End:</span>{" "}
              {formatMinutes(shiftPolicy.shiftEndMinutes)}
            </span>
            <span>
              <span className="font-semibold text-zinc-900">Grace:</span>{" "}
              {shiftPolicy.lateGraceMinutes} min
            </span>
          </div>
        </div>
      )}
       
       
       {readOnly ? (
        <div className='mb-8 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-start gap-3 animate-fade-in'>
          <AlertCircleIcon className='w-5 h-5 text-zinc-500 shrink-0 mt-0.5' />
          <p className='text-[14px] font-medium text-zinc-700 tracking-tight'>
            This account does not have an employee attendance profile. Use the dashboard and team pages to manage approvals.
          </p>
        </div>
       ) : isDeleted ? (
        <div className='mb-8 p-5 bg-red-50/80 border border-red-200/80 rounded-2xl flex items-center justify-center gap-3 animate-fade-in'>
          <AlertCircleIcon className='w-5 h-5 text-red-500' />
          <p className='text-[14px] font-medium text-red-600 tracking-tight'>
            You can no longer clock in or out because your employee records have been marked as deleted.
          </p>
        </div>
       ) : (
        
        // Check-in Component Container
        <div className='mb-8'>
          <CheckinButton todayRecord={todayRecord} onAction={fetchData}/>

          <AttendanceStats  history={history}/>
          

          <AttendanceHistory
            history={history}
            correctionByDate={correctionByDate}
            onRequestCorrection={(record) => {
              setCorrectionRecord(record)
              setCorrectionOpen(true)
            }}
          />
          
          
        </div>
        
       )}

       <RequestCorrectionModal
         open={correctionOpen}
         onClose={() => setCorrectionOpen(false)}
         record={correctionRecord}
         onSuccess={fetchData}
       />
       
       {/* Future Table or History list can go here below */}
       
    </div>
  )
}

export default Attendance
import React, { useCallback, useEffect, useState } from 'react'
import { dummyAttendanceData } from '../assets/assets'
import Loading from '../components/Loading'
import { AlertCircleIcon } from 'lucide-react'
import CheckinButton from '../components/attendance/CheckinButton'
import AttendanceStats from '../components/attendance/AttendanceStats'
import AttendanceHistory from '../components/attendance/AttendanceHistory'

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const fetchData = useCallback(async ()=>{
    setLoading(true)
    setHistory(dummyAttendanceData)
    setTimeout(()=>{
      setLoading(false)
    },1000)
  },[])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  if(loading) return <Loading />

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecord = history.find((r)=> new Date(r.date).toDateString() === today.toDateString())

  return (
    <div className='animate-fade-in'>
      
      {/* Page Header */}
      <div className='page-header'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle'>Track your work hours and daily check-ins</p>
      </div>
       
       
       {isDeleted ? (
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
          

          <AttendanceHistory history = {history}/>
          
          
        </div>
        
       )}
       
       {/* Future Table or History list can go here below */}
       
    </div>
  )
}

export default Attendance
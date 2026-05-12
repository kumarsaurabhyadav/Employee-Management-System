import React, { useEffect, useState } from 'react'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'
import Loading from '../components/Loading'
import EmployeeDashboard from '../components/EmployeeDashboard'
import AdminDashboard from '../components/AdminDashboard'
import api from '../api/axios'
import { toast } from 'react-hot-toast'
import { withMinLoader } from '../utils/loaderDelay'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await withMinLoader(() => api.get('/dashboard'))
        setData(res.data)
      } catch (err) {
        toast.error(err.response?.data?.error || err?.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <Loading />
  if (!data) return <p className='text-center text-slate-500 py-12'>Failed to load dashboard</p>

  if (data.role === "ADMIN" || data.role === "MANAGER") {
    return <AdminDashboard data={data} />
  } else {
    return <EmployeeDashboard data={data} />
  }
}

export default Dashboard
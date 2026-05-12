import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import NotificationsBell from '../components/notifications/NotificationsBell'

const Layout = () => {
    const {user, loading} = useAuth()

    if(loading) return <Loading />
    if(!user) return <Navigate to="/login"/>
    return (
        <div className='flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30'>
            <Sidebar/>
            <main className='flex flex-1 min-h-0 flex-col overflow-hidden'>
                <div className='fixed top-4 right-4 sm:right-6 lg:right-8 z-50'>
                    <NotificationsBell />
                </div>
                <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-400 mx-auto w-full'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout
import { Building2Icon, CalendarIcon, FileTextIcon, UserIcon, ArrowRightIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = ({data}) => {
    const stats = [
        {
            icon: UserIcon,
            value: data.totalEmployees,
            title: 'Total Employees',
            subtitle: 'Active workforce'
        },
        {
            icon: Building2Icon,
            value: data.totalDepartments,
            title: 'Departments',
            subtitle: 'Organization units'
        },
         {
            icon: CalendarIcon,
            value: data.todayAttendance,
            title: "Today's Attendance",
            subtitle: 'Checked in today'
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            title: "Pending Leaves",
            subtitle: 'Awaiting approval'
        },
    ]

  return (
     <div className='animate-fade-in'>
            {/* Page Header */}
            <div className='page-header'>
                <h1 className='page-title'>Dashboard</h1>
                <p className='page-subtitle'>
                    Welcome back, Admin - here's your overview
                </p>
            </div>

            {/* Premium Stat Cards */}
            {/* 4 items hain toh large screen par grid-cols-4 perfect lagega */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
                {stats.map((s, index) => (
                    <div key={index} className='card card-hover p-6 relative overflow-hidden group flex items-start justify-between'>
                        
                        {/* Sharp Black Left-Indicator on Hover */}
                        <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-transparent group-hover:bg-black transition-colors duration-300'/>
                        
                        <div>
                            {/* FIX: s.label ki jagah s.title kar diya hai */}
                            <p className='text-sm font-medium text-zinc-500 mb-1.5'>{s.title}</p>
                            <p className='text-3xl font-bold text-black tracking-tight'>{s.value}</p>
                            <p className='text-xs font-medium text-zinc-400 mt-2'>{s.subtitle}</p>
                        </div>

                        {/* Icon Box: Inverse Black Effect */}
                        <div className='p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shadow-sm'>
                            <s.icon className='w-5 h-5'/>
                        </div>
                    </div>
                ))}
            </div>

            {/* Admin Quick Actions (Dashboard ko complete feel dene ke liye) */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <Link to='/employees' className='btn-primary group inline-flex items-center justify-center gap-2'>
                    <PlusIcon className='w-4 h-4' />
                    Add New Employee 
                </Link>

                <Link to='/leave' className='btn-secondary hover:shadow-sm inline-flex items-center justify-center gap-2 group'>
                    Review Leaves
                    <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </Link>
            </div>
        </div>
  )
}

export default AdminDashboard
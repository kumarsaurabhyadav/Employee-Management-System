import { CalendarIcon, DollarSignIcon, FileTextIcon, ArrowRightIcon } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'

const EmployeeDashboard = ({ data }) => {
    const emp = data.employee;

    const cards = [
        {
            icon: CalendarIcon,
            value: data.currentMonthAttendance,
            title: 'Days Present',
            subtitle: 'This month'
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            title: 'Pending Leaves',
            subtitle: 'Awaiting approval'
        },
        {
            icon: DollarSignIcon,
            value: data?.latestPayslip ? `$${data?.latestPayslip?.netSalary?.toLocaleString()}` : 'N/A',
            title: 'Latest Payslip',
            subtitle: 'Most recent payout'
        }
    ]

    return (
        <div className='animate-fade-in'>
            {/* Page Header (Uses classes from your new index.css) */}
            <div className='page-header'>
                <h1 className='page-title'>Welcome, {emp?.firstName}!</h1>
                <p className='page-subtitle'>
                    {emp?.position} • {emp?.department || "No Department"}
                </p>
            </div>

            {/* Premium Stat Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10'>
                {cards.map((card, index) => (
                    <div key={index} className='card card-hover p-6 relative overflow-hidden group flex items-start justify-between'>
                        
                        {/* Sharp Black Left-Indicator on Hover */}
                        <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-transparent group-hover:bg-black transition-colors duration-300'/>
                        
                        <div>
                            <p className='text-sm font-medium text-zinc-500 mb-1.5'>{card.title}</p>
                            <p className='text-3xl font-bold text-black tracking-tight'>{card.value}</p>
                            <p className='text-xs font-medium text-zinc-400 mt-2'>{card.subtitle}</p>
                        </div>

                        {/* Icon Box: Light mode normally, Pure Black on hover (Inverse Effect) */}
                        <div className='p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shadow-sm'>
                            <card.icon className='w-5 h-5'/>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
                {/* Primary Button with Micro-interaction (Arrow slide) */}
                <Link to='/attendence' className='btn-primary group inline-flex items-center justify-center gap-2'>
                    Mark Attendance
                    <ArrowRightIcon className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </Link>

                <Link to='/leave' className='btn-secondary hover:shadow-sm inline-flex items-center justify-center gap-2'>
                    Apply for Leave
                </Link>
            </div>
        </div>
    )
}

export default EmployeeDashboard
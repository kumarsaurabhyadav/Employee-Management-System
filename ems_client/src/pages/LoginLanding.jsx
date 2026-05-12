import { ArrowRightIcon, Copyright, ShieldIcon, UserIcon } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import LoginLeftSide from '../components/LoginLeftSide';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const LoginLanding = () => {
    const {user, loading} = useAuth()
    const navigate = useNavigate()
    
    if (loading) return <Loading />

    if (user) {
        return (
            <div className='min-h-screen flex flex-col md:flex-row bg-white'>
                <LoginLeftSide />
                <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen bg-white'>
                    <div className='w-full max-w-md animate-fade-in text-center'>
                        <h1 className='text-3xl font-bold text-slate-900 mb-4'>Already signed in</h1>
                        <p className='text-slate-500 mb-8'>You are already logged in. Go to your dashboard to continue working.</p>
                        <button
                            type='button'
                            onClick={() => navigate('/dashboard')}
                            className='w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition-all duration-200'
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const portalOptions = [
        {
            to: '/login/admin',
            title: 'Admin Portal',
            description: "Manage employees, departments, payroll, and system configurations.",
            icon: ShieldIcon
        },
        {
            to: '/login/manager',
            title: 'Manager Portal',
            description: "Approve team leave requests, overtime, and attendance corrections.",
            icon: ShieldIcon
        },
        {
            to: '/login/employee',
            title: 'Employee Portal',
            description: "View your profile, track attendance, request time off, and access payslips.",
            icon: UserIcon
        }
    ];

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white'>
        <LoginLeftSide/>

        {/* Light theme background for right side */}
        <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen bg-white'>

            <div className='w-full max-w-md animate-fade-in relative'>

                {/* Header */}
                <div className='mb-10 text-center md:text-left'>
                    <h2 className='text-3xl font-semibold text-slate-900 tracking-tight mb-3'>Welcome Back</h2>
                    <p className='text-slate-500'>Select your portal to securely access the system.</p>
                </div>

                {/* Portals List */}
                <div className='space-y-4'>
                    {portalOptions.map((portal) => (
                        <Link 
                            key={portal.to} 
                            to={portal.to} 
                            className='group block bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5'
                        >
                            <div className='flex items-start gap-5'>
                                {/* Icon Container */}
                                <div className='p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors'>
                                    <portal.icon className='w-6 h-6 text-slate-600 group-hover:text-black transition-colors' />
                                </div>
                                
                                {/* Content Container */}
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between mb-1.5'>
                                        <h3 className='text-lg font-medium text-slate-900 transition-colors'>
                                            {portal.title}
                                        </h3>
                                        <ArrowRightIcon className='w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300'/>
                                    </div>
                                    <p className='text-sm text-slate-500 leading-relaxed'>
                                        {portal.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className='mt-16 flex items-center justify-center md:text-left text-sm text-slate-400'>
                    <Copyright className='w-4 h-4 mr-1.5' /> 
                    <span>{new Date().getFullYear()} Love. All rights reserved.</span>
                </div>

            </div>
        </div>
    </div>
  );
}

export default LoginLanding;
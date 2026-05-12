import React, { useState } from 'react';
import LoginLeftSide from './LoginLeftSide';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon, SparklesIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'

const LoginForm = ({ role, title, subtitle }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setloading] = useState(false);
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setloading(true);

        try {
            await login(email, password, role)
            navigate("/dashboard")
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Login failed")
        } finally {
            setloading(false)
        }
    };

    // 🚀 THE FIX: Dynamic Demo Credentials based on Role
    const getDemoCredentials = () => {
        const currentRole = (role || "employee").toLowerCase();
        
        if (currentRole === "admin") {
            return { email: 'saurabhrahul101@gmail.com', pass: 'admin123', label: 'Admin Account' };
        }
        if (currentRole === "manager") {
            return { email: 'manager@text.com', pass: '12345678', label: 'Manager Account' };
        }
        return { email: 'testme@employee.com', pass: '12345678', label: 'Employee Account' };
    };

    const demoData = getDemoCredentials();

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-white'>
            <LoginLeftSide />
            
            {/* Right Side Container */}
            <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto min-h-screen bg-white'>
                
                <div className='w-full max-w-90 animate-fade-in'>
                    
                    {/* Back Button */}
                    <Link to={'/login'} className='inline-flex items-center gap-2 text-zinc-400 hover:text-black text-sm mb-6 transition-all duration-300 font-medium group w-fit'>
                        <ArrowLeftIcon size={16} className='group-hover:-translate-x-1 transition-transform duration-300' /> 
                        Back to portals
                    </Link>

                    {/* Header */}
                    <div className='mb-6'>
                        <h1 className='text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mb-2'>{title || "Employee Portal"}</h1>
                        <p className='text-zinc-500 font-medium text-sm'>{subtitle || "Sign in to access your account"}</p>
                    </div>

                    {/* Error Message Box */}
                    {error && (
                        <div className='mb-5 p-3.5 bg-red-50 border border-red-100/50 text-red-600 text-sm rounded-xl flex items-start gap-3 animate-fade-in'>
                            <div className='w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0'/>
                            <p className='leading-relaxed font-medium'>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form className='space-y-4' onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div className='space-y-1.5'>
                            <label className='block text-[11px] font-bold uppercase tracking-widest text-zinc-600'>Email address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)} 
                                required 
                                placeholder='name@company.com' 
                                className='w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm font-medium placeholder:text-zinc-400 text-zinc-900 hover:bg-zinc-100/50'
                            />
                        </div>

                        {/* Password Input */}
                        <div className='space-y-1.5'>
                            <div className='flex items-center justify-between'>
                                <label className='block text-[11px] font-bold uppercase tracking-widest text-zinc-600'>Password</label>
                                <Link
                                    to={`/forgot-password?role=${encodeURIComponent(role || "employee")}`}
                                    className='text-xs font-bold text-zinc-500 hover:text-black hover:underline underline-offset-2 transition-all'
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className='relative'>
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}  
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    required 
                                    placeholder='••••••••' 
                                    className='w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm font-medium placeholder:text-zinc-400 pr-11 text-zinc-900 hover:bg-zinc-100/50'
                                />
                                <button 
                                    type='button' 
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors p-1.5 outline-none' 
                                    onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Pure Black Main Button */}
                        <button
                            disabled={loading}
                            className='w-full py-3.5 mt-2 bg-zinc-900 text-white rounded-xl text-[13px] font-bold uppercase tracking-widest hover:bg-black hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none transition-all duration-300 active:scale-[0.98] flex items-center justify-center'
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className='animate-spin h-4 w-4 mr-2' />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign in to account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='relative mt-8 mb-6'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-zinc-200'></div>
                        </div>
                        <div className='relative flex justify-center text-xs'>
                            <span className='px-3 bg-white text-[10px] font-bold uppercase tracking-widest text-zinc-400'>Or continue with</span>
                        </div>
                    </div>

                    {/* SSO Secondary Button */}
                    <button type="button" className='w-full py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 hover:text-black hover:border-zinc-300 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm active:scale-95'>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Company SSO
                    </button>

                    {/* 🚀 THE FIX: Premium & Dynamic Demo Credentials Section */}
                    <div className='mt-8 p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl relative overflow-hidden group'>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-300 group-hover:bg-zinc-900 transition-colors duration-300" />
                        
                        <div className='flex items-center justify-between mb-3 pl-2'>
                            <div>
                                <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest'>Demo Access</p>
                                <p className='text-xs font-medium text-zinc-600 mt-0.5'>Test the system instantly</p>
                            </div>
                            <div className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-400 shadow-sm">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => {
                                setEmail(demoData.email);
                                setPassword(demoData.pass);
                            }}
                            className='w-full py-3 px-4 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-left hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-200 shadow-sm flex items-center justify-between group/btn'
                        >
                            <div>
                                <div className='text-sm font-bold text-zinc-900'>{demoData.label}</div>
                                <div className='text-xs font-medium text-zinc-500 mt-0.5 tracking-tight'>{demoData.email}</div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/btn:text-zinc-900 transition-colors">
                                Auto-Fill
                            </span>
                        </button>
                    </div>

                    {/* IT Support Link */}
                    <p className='text-center text-xs text-zinc-500 mt-8 font-medium'>
                        Having trouble signing in? <br className="sm:hidden" />
                        <a href="#" className='font-bold text-zinc-900 hover:underline underline-offset-4 ml-1'>Contact IT Support</a>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default LoginForm;
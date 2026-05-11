import React, { useState } from 'react';
import LoginLeftSide from './LoginLeftSide';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
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
        setTimeout(() => setloading(false), 2000);

        try {
            await login(email, password, role)
            navigate("/dashboard")
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Login failed")
        }finally{
            setloading(false)
        }
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-white'>
            <LoginLeftSide />
            
            {/* Right Side Container */}
            <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto min-h-screen bg-white'>
                
                {/* Removed extra height, kept it strictly to max-w-[360px] */}
                <div className='w-full max-w-90 animate-fade-in'>
                    
                    {/* Back Button - Spacing reduced */}
                    <Link to={'/login'} className='inline-flex items-center gap-2 text-zinc-400 hover:text-black text-sm mb-6 transition-all duration-300 font-medium group w-fit'>
                        <ArrowLeftIcon size={16} className='group-hover:-translate-x-1 transition-transform duration-300' /> 
                        Back to portals
                    </Link>

                    {/* Header - Margins reduced */}
                    <div className='mb-6'>
                        <h1 className='text-2xl sm:text-3xl font-semibold text-black tracking-tight mb-2'>{title || "Employee Portal"}</h1>
                        <p className='text-zinc-500 text-sm'>{subtitle || "Sign in to access your account"}</p>
                    </div>

                    {/* Error Message Box */}
                    {error && (
                        <div className='mb-5 p-3.5 bg-red-50 border border-red-100/50 text-red-600 text-sm rounded-xl flex items-start gap-3 animate-fade-in'>
                            <div className='w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0'/>
                            <p className='leading-relaxed'>{error}</p>
                        </div>
                    )}

                    {/* Form - space-y-4 for tighter inputs */}
                    <form className='space-y-4' onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div className='space-y-1.5'>
                            <label className='block text-xs font-medium text-zinc-700'>Email address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)} 
                                required 
                                placeholder='name@company.com' 
                                className='w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm placeholder:text-zinc-400 text-black hover:bg-zinc-50'
                            />
                        </div>

                        {/* Password Input */}
                        <div className='space-y-1.5'>
                            <div className='flex items-center justify-between'>
                                <label className='block text-xs font-medium text-zinc-700'>Password</label>
                                <a href="#" className='text-xs font-medium text-zinc-500 hover:text-black transition-colors'>Forgot password?</a>
                            </div>
                            <div className='relative'>
                                <input 
                                    type={showPassword ? 'text' : 'password'}  
                                    onChange={(e)=>setPassword(e.target.value)} 
                                    required 
                                    placeholder='••••••••' 
                                    className='w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm placeholder:text-zinc-400 pr-11 text-black hover:bg-zinc-50'
                                />
                                <button 
                                    type='button' 
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors p-1.5' 
                                    onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Pure Black Main Button */}
                        <button
                            disabled={loading}
                            className='w-full py-3 mt-1 bg-black text-white rounded-xl text-sm font-medium hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] flex items-center justify-center'
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

                    {/* Divider - Margins shrunk */}
                    <div className='relative mt-6 mb-5'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-zinc-200'></div>
                        </div>
                        <div className='relative flex justify-center text-xs'>
                            <span className='px-3 bg-white text-zinc-400 font-medium'>Or continue with</span>
                        </div>
                    </div>

                    {/* SSO Secondary Button */}
                    <button type="button" className='w-full py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 hover:text-black transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm'>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Company SSO
                    </button>

                    {/* IT Support Link - Margins shrunk, text size reduced */}
                    <p className='text-center text-xs text-zinc-500 mt-6'>
                        Having trouble signing in? <br className="sm:hidden" />
                        <a href="#" className='font-medium text-black hover:underline underline-offset-4 ml-1'>Contact IT Support</a>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default LoginForm;
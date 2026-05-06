import React, { useEffect, useState } from 'react'
import { href, Link, useLocation } from 'react-router-dom'
import { dummyProfileData } from '../assets/assets'
import { CalendarIcon, ChevronRightIcon, DollarSignIcon, FileTextIcon, LayoutGridIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon } from 'lucide-react'

const Sidebar = () => {
    const { pathname } = useLocation()
    const [userName, setUserName] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        setUserName(dummyProfileData.firstName + " " + dummyProfileData.lastName)
    }, [])

    //Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // LOGIC 100% UNTOUCHED
    const role = "" || "empoloyee"
    const navItems = [
        {name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon},
        role === "ADMIN" ?
        {name: "Employees", href: "/employees", icon: UserIcon} : 
        {name: "Attendence", href: "/attendence", icon: CalendarIcon},
        {name: "Leave", href: "/leave", icon: FileTextIcon},
        {name: "Payslips", href: "/payslips", icon: DollarSignIcon},
        {name: "Settings", href: "/settings", icon: SettingsIcon}
    ]

    const handleLogout = () => {
        window.location.href = "/login"
    }

    const sidebarContent = (
        <>
            {/* Brand header */}
            <div className='px-5 pt-6 pb-5 border-b border-white/10'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        {/* Logo box me halka glow add kiya */}
                        <div className='p-1.5 bg-white/5 border border-white/10 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.03)]'>
                            <UserIcon className='text-zinc-200 w-5 h-5' />
                        </div>

                        <div>
                            <p className='font-semibold text-[13px] text-zinc-100 tracking-wide'>Employee MS</p>
                            <p className='text-[11px] text-zinc-500 font-medium'>Management System</p>
                        </div>
                    </div>
                    {/* close button on mobile */}
                    <button
                    onClick={()=>setMobileOpen(false)} className='lg:hidden text-zinc-500 hover:text-zinc-300 transition-colors p-1'>
                        <XIcon size={20}/>
                    </button>
                </div>
            </div>

            {/* User profile card */}
            {userName && (
                <div className='mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default'>
                    <div className='flex items-center gap-3'>
                        {/* Avatar ring thodi aur premium ki */}
                        <div className='w-9 h-9 rounded-lg bg-zinc-800/80 flex items-center justify-center ring-1 ring-white/20 shrink-0 shadow-inner'>
                            <span className='text-zinc-200 font-medium'>
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className='min-w-0'>
                            <p className='text-[13px] font-medium text-zinc-200 truncate'>{userName}</p>
                            <p className='text-[13px] text-zinc-500 truncate '>{role ==="ADMIN" ? "Administrator" : "Employee"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* section label */}
            <div className='px-5 pt-5 pb-2'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500'>Navigation</p>
            </div>

            {/* Navigation List - Custom Scrollbar Hide Classes Added */}
            <div className='flex-1 px-3 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                {navItems.map((item)=>{
                    const isActive = pathname.startsWith(item.href)
                    return(
                        <Link key={item.name} to={item.href} className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200 relative ${isActive ? "bg-white/10 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"}`}>
                        
                        {/* 1. Titanium Gradient Active Line */}
                        {isActive && <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-linear-to-b from-zinc-200 to-zinc-500 shadow-[0_0_8px_rgba(255,255,255,0.3)]' />}
                        
                        {/* 2. Micro-animation: Icon slight move on hover */}
                        <item.icon className = {`w-4 h-4 shrink-0 transition-all duration-200 ${isActive ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-300 group-hover:scale-110"}`}/>
                        
                        {/* 3. Micro-animation: Text slight slide on hover */}
                        <span className={`flex-1 transition-transform duration-200 ${!isActive && 'group-hover:translate-x-0.5'}`}>{item.name}</span>
                        
                        {isActive && <ChevronRightIcon className='w-3.5 h-3.5 text-zinc-500'/>}
                        </Link>
                    )
                })}
            </div>

            {/* Logout */}
            <div className='p-3 border-t border-white/10'>
                {/* Micro-animation on Logout too */}
                <button onClick={handleLogout} className='group flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200'>
                    <LogOutIcon className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200'/>
                    <span className='group-hover:translate-x-0.5 transition-transform duration-200'>Log out</span>
                </button>
            </div>

        </>
    )
    return (
        <>
            {/* Mobile hamburger button */}
            <button onClick={() => setMobileOpen(true)} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg border border-white/10'>
                <MenuIcon size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && <div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity' onClick={() => setMobileOpen(false)} />}

            {/* Sidebar - desktop */}
            <aside className='hidden lg:flex flex-col h-full w-64 bg-black text-white shrink-0 border-r border-white/10'>
                {sidebarContent}
            </aside>

            {/* Sidebar - mobile */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-black text-white z-50 flex-col transform transition-transform duration-300 border-r border-white/10 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {sidebarContent}
            </aside>
        </>
    )
}

export default Sidebar
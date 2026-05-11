import React, { useCallback, useEffect, useState } from 'react'
import { DEPARTMENTS } from '../assets/assets'
import { Plus, Search, LayoutGridIcon, X, SlidersHorizontal, Users } from 'lucide-react'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeForm from '../components/EmployeeForm'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import { withMinLoader } from '../utils/loaderDelay'

const Employees = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const isManager = user?.role === "MANAGER"
  const canEditRoster = isAdmin
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectDept, setSelectDept] = useState('')
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModel, setShowCreateModel] = useState(false)

  useEffect(() => {
    if (isManager && user?.department) {
      setSelectDept(user.department)
    }
  }, [isManager, user?.department])

  const fetchEmployees = useCallback(async ()=> {
    setLoading(true)
    try {
      const url = selectDept ? `/employees?department=${selectDept}` : "/employees";
      const res = await withMinLoader(() => api.get(url))
      setEmployees(res.data)
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false)
    }
  }, [selectDept])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filtered = employees.filter((emp)=>`${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()))

  return (
    // 🚀 PREMIUM UPGRADE 1: Subtle Dot Grid Background
    <div className='min-h-screen relative animate-fade-in'>
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 pb-20">
            {/* ------- HEADER -------- */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10'>
                <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-zinc-900 rounded-xl shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <h1 className='text-3xl sm:text-4xl font-black text-zinc-900 tracking-tighter'>Employees</h1>
                </div>
                <p className='text-sm font-medium text-zinc-500 ml-1'>
                  {isManager ? "View employees in your department (read-only)." : "Manage your employees and organizational structure."}
                </p>
                </div>
                
                {canEditRoster && (
                <button 
                    onClick={()=>setShowCreateModel(true)} 
                    className='px-6 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-widest text-white bg-zinc-900 hover:bg-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5 w-full sm:w-auto justify-center active:scale-95'
                >
                <Plus size={18} strokeWidth={3} /> Add Employee
                </button>
                )}
            </div>

            {/* 🚀 PREMIUM UPGRADE 2: Unified Glass Control Bar */}
            <div className='bg-white/80 backdrop-blur-md border border-zinc-200/80 p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-2 mb-10 transition-shadow focus-within:shadow-md focus-within:border-zinc-300'>
                
                {/* Search Input */}
                <div className='relative flex-1 w-full flex items-center'>
                    <Search className='absolute left-4 text-zinc-400 w-4 h-4'/>
                    <input 
                        placeholder='Search by name, position or email...' 
                        className='w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal' 
                        onChange={(e)=>setSearch(e.target.value)} 
                        value={search} 
                    />
                </div>
                
                {/* Vertical Divider (Hidden on mobile) */}
                <div className="hidden sm:block w-px h-6 bg-zinc-200"></div>
                
                {/* Filter Dropdown */}
                <div className="relative w-full sm:w-auto flex items-center bg-zinc-50/50 sm:bg-transparent rounded-xl sm:rounded-none px-2 sm:px-0 mt-2 sm:mt-0">
                    <SlidersHorizontal className="absolute left-4 sm:left-2 text-zinc-400 w-4 h-4" />
                    <select 
                        value={isManager && user?.department ? user.department : selectDept} 
                        onChange={(e)=>setSelectDept(e.target.value)} 
                        disabled={isManager}
                        className='w-full sm:w-48 pl-11 sm:pl-9 pr-8 py-3 bg-transparent border-none focus:ring-0 text-sm font-bold text-zinc-700 appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {!isManager && <option value="">All Departments</option>}
                        {DEPARTMENTS.map((deptName)=>(
                            <option key={deptName} value={deptName}>{deptName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* -------- EMPLOYEE LIST & LOADER -------- */}
            {loading ? (
                <Loading embedded />
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 gap-5'>
                {filtered.length === 0 ? (
                    // 🚀 PREMIUM UPGRADE 3: Stunning Empty State
                    <div className='col-span-full flex flex-col items-center justify-center py-24 bg-white/50 rounded-4xl border-2 border-dashed border-zinc-200'>
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100 shadow-sm">
                            <Search className='w-8 h-8 text-zinc-300' />
                        </div>
                        <p className='text-base font-bold text-zinc-900'>No employees found</p>
                        <p className='text-sm font-medium text-zinc-500 mt-1 text-center max-w-sm'>We couldn't find any team members matching your current search criteria.</p>
                        {search && (
                            <button onClick={() => setSearch('')} className="mt-4 text-[12px] font-bold text-zinc-900 bg-zinc-100 px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest">
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    filtered.map((emp)=> (
                        <EmployeeCard 
                            key={emp._id || emp.id} 
                            employee={emp} 
                            onDelete={fetchEmployees} 
                            onEdit={(emp)=>setEditEmployee(emp)}
                            readOnly={!canEditRoster}
                        />
                    ))
                )}
                </div>
            )}

            {/* ======== CREATE EMPLOYEE MODAL ======== */}
            {showCreateModel && (
                <div className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in' onClick={()=>setShowCreateModel(false)}>
                
                <div className='relative bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-zinc-100 w-full max-w-3xl mb-8 animate-slide-up' onClick={(e)=>e.stopPropagation()}>
                    
                    <div className='flex items-center justify-between p-6 sm:p-8 border-b border-zinc-100'>
                    <div>
                        <h2 className='text-2xl font-black text-zinc-900 tracking-tight'>Add New Employee</h2>
                        <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Create a user account and employee profile</p>
                    </div>
                    <button onClick={()=>setShowCreateModel(false)} className='p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900 border border-zinc-200'>
                        <X className='w-5 h-5'/>
                    </button>
                    </div>
                    
                    <div className='p-6 sm:p-8 bg-zinc-50/30 rounded-b-4xl'>
                    <EmployeeForm 
                        onSuccess={()=>{
                        setShowCreateModel(false);
                        fetchEmployees(); 
                        }} 
                        onCancel={()=>setShowCreateModel(false)}
                    />
                    </div>
                </div>
                </div>
            )}

            {/* ======== EDIT EMPLOYEE MODAL ======== */}
            {editEmployee && (
                <div className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-fade-in' onClick={()=>setEditEmployee(null)}>
                
                <div className='relative bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-zinc-100 w-full max-w-3xl mb-8 animate-slide-up' onClick={(e)=>e.stopPropagation()}>
                    
                    <div className='flex items-center justify-between p-6 sm:p-8 border-b border-zinc-100'>
                    <div>
                        <h2 className='text-2xl font-black text-zinc-900 tracking-tight'>Edit Employee</h2>
                        <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Update employee details and permissions</p>
                    </div>
                    <button onClick={()=>setEditEmployee(null)} className='p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900 border border-zinc-200'>
                        <X className='w-5 h-5'/>
                    </button>
                    </div>
                    
                    <div className='p-6 sm:p-8 bg-zinc-50/30 rounded-b-4xl'>
                        <EmployeeForm 
                            initialData={editEmployee} 
                            onSuccess={()=>{
                            setEditEmployee(null);
                            fetchEmployees(); 
                            }} 
                            onCancel={()=>setEditEmployee(null)}
                        />
                    </div>
                </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default Employees
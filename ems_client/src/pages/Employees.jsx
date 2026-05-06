import React, { useCallback, useEffect, useState } from 'react'
import { DEPARTMENTS, dummyEmployeeData } from '../assets/assets'
import { Plus, Search, LayoutGridIcon, X } from 'lucide-react'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeForm from '../components/EmployeeForm'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectDept, setSelectDept] = useState('')
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModel, setShowCreateModel] = useState(false)

  const fetchEmployees = useCallback(async ()=> {
    setLoading(true)
    setEmployees(dummyEmployeeData.filter((emp)=>(selectDept ? emp.department === selectDept : emp)))
    setTimeout(()=>{
      setLoading(false)
    },1000)
  },[selectDept])

  useEffect(()=>{
    fetchEmployees()
  },[fetchEmployees])

  const filtered = employees.filter((emp)=>`${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='animate-fade-in'>
      {/* -------header-------- */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Employees</h1>
          <p className='page-subtitle'>Manage your team members</p>
        </div>
        
        <button onClick={()=>setShowCreateModel(true)} className='btn-primary flex items-center gap-2 w-full sm:w-auto justify-center'>
          <Plus size={16}/> Add Employee
        </button>
      </div>

      {/* ---------search bar--------- */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4'/>
          <input placeholder='Search employees.....' className='w-full pl-10' onChange={(e)=>setSearch(e.target.value)} value={search} />
        </div>
        
        <select value={selectDept} onChange={(e)=>setSelectDept(e.target.value)} className='w-full sm:max-w-40'>
          <option value="">All Departments</option>
          {DEPARTMENTS.map((deptName)=>(
            <option key={deptName} value={deptName}>{deptName}</option>
          ))}
        </select>
      </div>

      {/* --------employee card & Loader -------- */}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-24'>
            <div className='relative flex items-center justify-center'>
                <div className='w-12 h-12 border-[3px] border-zinc-100 border-t-black border-r-black/30 rounded-full animate-spin'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                    <LayoutGridIcon className='w-4 h-4 text-zinc-300 animate-pulse' />
                </div>
            </div>
            <div className='mt-5 flex flex-col items-center'>
                <p className='text-[13px] font-semibold tracking-widest text-zinc-900 uppercase'>
                    Workspace
                </p>
                <p className='text-xs font-medium text-zinc-500 mt-1 animate-pulse'>
                    Loading employees...
                </p>
            </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5 gap-4'>
          {filtered.length === 0 ? (
            <p className='col-span-full text-center py-16 text-zinc-500 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-300'>No employees found</p>
          ) : (
            filtered.map((emp)=> (<EmployeeCard key={emp.id} employee={emp} onDelete={fetchEmployees} onEdit={(e)=>setEditEmployee(e)}/>))
          )}
        </div>
      )}

      {/*        CREATE EMPLOYEE MODAL    */}
      
      {showCreateModel && (
        <div className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/40 backdrop-blur-sm transition-opacity' onClick={()=>setShowCreateModel(false)}>
          
          <div className='relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-200 w-full max-w-3xl mb-8 animate-slide-up' onClick={(e)=>e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-zinc-100'>
              <div>
                <h2 className='text-xl font-semibold text-black tracking-tight'>Add New Employee</h2>
                <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Create a user account and employee profile</p>
              </div>
              <button onClick={()=>setShowCreateModel(false)} className='p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700'>
                <X className='w-5 h-5'/>
              </button>
            </div>
            
            {/* Modal Body / Form Area */}
            <div className='p-6'>
              
              <EmployeeForm onSuccess={()=>{
                  setShowCreateModel(false);
                  fetchEmployees();
                }} onCancel={()=>setShowCreateModel(false)}/>
            </div>
          </div>
        </div>
      )}

      {/*         EDIT EMPLOYEE MODAL      */}
      
      {editEmployee && (
        <div className='fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto bg-zinc-950/40 backdrop-blur-sm transition-opacity' onClick={()=>setEditEmployee(null)}>
          
          <div className='relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-200 w-full max-w-3xl mb-8 animate-slide-up' onClick={(e)=>e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-zinc-100'>
              <div>
                <h2 className='text-xl font-semibold text-black tracking-tight'>Edit Employee</h2>
                <p className='text-[13px] text-zinc-500 mt-1 font-medium'>Update employee details and permissions</p>
              </div>
              <button onClick={()=>setEditEmployee(null)} className='p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700'>
                <X className='w-5 h-5'/>
              </button>
            </div>
            
            {/* Modal Body / Form Area */}
            <div className='p-6'>
                {/* aapka form yahan aayega */}
                <EmployeeForm initialData={editEmployee} onSuccess={()=>{
                  setEditEmployee(null);
                  fetchEmployees();
                }} onCancel={()=>setEditEmployee(null)}/>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Employees
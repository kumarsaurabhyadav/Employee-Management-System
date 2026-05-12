import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEPARTMENTS } from '../assets/assets'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { withMinLoader } from '../utils/loaderDelay'
import { Loader2, User, Briefcase, ShieldCheck } from 'lucide-react' 

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        if(isEditMode){
            const pwd = formData.get("password")
            if(!pwd) formData.delete("password")
        }

        try {
            const url = isEditMode ? `/employees/${initialData.id}` : "/employees";
            const method = isEditMode ? "put" : "post";

            await withMinLoader(() => api[method](url, formData))

            toast.success(isEditMode ? "Employee updated successfully!" : "Employee created successfully!");

            if (onSuccess) {
                onSuccess();
            } else {
                navigate("/employees");
            }

        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm text-zinc-900 placeholder:text-zinc-400 hover:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400";
    const labelClass = "block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 pl-1";
    const cardClass = "bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden mb-8";

    return (
        <form onSubmit={handleSubmit} className='max-w-4xl mx-auto animate-fade-in pb-10'>

            {/* ======== PERSONAL INFORMATION ======== */}
            <div className={cardClass}>
                <h3 className='text-lg font-bold text-zinc-900 tracking-tight mb-6 pb-5 border-b border-zinc-100 flex items-center gap-3'>
                    <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                        <User className='w-4 h-4 text-zinc-600' />
                    </div>
                    Personal Information
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input name='firstName' required defaultValue={initialData?.firstName} className={inputClass} placeholder="Enter first name" />
                    </div>

                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input name='lastName' required defaultValue={initialData?.lastName} className={inputClass} placeholder="Enter last name" />
                    </div>

                    <div>
                        <label className={labelClass}>Phone Number</label>
                        <input name='phone' required defaultValue={initialData?.phone} className={inputClass} placeholder="e.g. +1 234 567 890" />
                    </div>

                    <div>
                        <label className={labelClass}>Join Date</label>
                        <input type='date' name='joinDate' required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ""} className={inputClass} />
                    </div>

                    <div className='sm:col-span-2'>
                        <label className={labelClass}>Bio (Optional)</label>
                        <textarea name='bio' defaultValue={initialData?.bio} rows={3} className={`${inputClass} resize-none`} placeholder='Brief description...' />
                    </div>
                </div>
            </div>

            {/* ======== EMPLOYMENT DETAILS ======== */}
            <div className={cardClass}>
                <h3 className='text-lg font-bold text-zinc-900 tracking-tight mb-6 pb-5 border-b border-zinc-100 flex items-center gap-3'>
                    <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                        <Briefcase className='w-4 h-4 text-zinc-600' />
                    </div>
                    Employment Details
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                        <label className={labelClass}>Department</label>
                        <select name="department" required defaultValue={initialData?.department || ""} className={inputClass}>
                            <option value="" disabled>Select Department</option>
                            {DEPARTMENTS.map((deptName) => (
                                <option key={deptName} value={deptName} >{deptName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Position</label>
                        <input name='position' required defaultValue={initialData?.position} className={inputClass} placeholder="e.g. Senior Developer" />
                    </div>

                    <div>
                        <label className={labelClass}>Basic Salary</label>
                        <input type='number' name='basicsalary' required min='0' step='0.01' defaultValue={initialData?.basicsalary ?? 0} className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Allowances</label>
                        <input type='number' name='allowances' required min='0' step='0.01' defaultValue={initialData?.allowances ?? 0} className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Deductions</label>
                        <input type='number' name='deductions' required min='0' step='0.01' defaultValue={initialData?.deductions ?? 0} className={inputClass} />
                    </div>

                    {isEditMode && (
                        <div>
                            <label className={labelClass}>Status</label>
                            <select name='employmentStatus' defaultValue={initialData?.employmentStatus} className={inputClass}>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* ======== ACCOUNT SETUP ======== */}
            <div className={cardClass}>
                <h3 className='text-lg font-bold text-zinc-900 tracking-tight mb-6 pb-5 border-b border-zinc-100 flex items-center gap-3'>
                    <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200">
                        <ShieldCheck className='w-4 h-4 text-zinc-600' />
                    </div>
                    Account Setup
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div className='sm:col-span-2'>
                        <label className={labelClass}>Work Email</label>
                        <input type='email' name='email' required defaultValue={initialData?.email} className={inputClass} placeholder="name@company.com" />
                    </div>
                    
                    {!isEditMode && (
                        <div>
                            <label className={labelClass}>Temporary Password</label>
                            <input type='password' name='password' required className={inputClass} placeholder="Enter secure password" />
                        </div>
                    )}

                    {isEditMode && (
                        <div>
                            <label className={labelClass}>Change Password (Optional)</label>
                            <input type='password' name='password' placeholder='Leave blank to keep current' className={inputClass} />
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>System Role</label>
                        <select name="role" defaultValue={initialData?.user?.role || "EMPLOYEE"} className={inputClass}>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ======== BUTTONS ======== */}
            <div className='flex flex-col-reverse sm:flex-row justify-end gap-4'>
                <button 
                    type="button" 
                    disabled={loading}
                    // 🚀 FIX 1: transition-all hata kar transition-colors kar diya, taaki slide na ho
                    className='px-6 py-3.5 rounded-xl text-sm font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed' 
                    onClick={()=>(onCancel ? onCancel() : navigate(-1))}
                >
                    Cancel
                </button>

                <button 
                    type='submit' 
                    disabled={loading} 
                    // 🚀 FIX 2: sm:min-w-[220px] add kiya taaki width hamesha fixed rahe aur button sikude nahi
                    className='sm:min-w-55 px-8 py-3.5 rounded-xl text-[13px] font-bold text-white bg-zinc-900 hover:bg-black border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 uppercase tracking-widest disabled:opacity-80 disabled:hover:translate-y-0 disabled:cursor-not-allowed w-full sm:w-auto'
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? "Saving..." : isEditMode ? "Update Employee" : "Create Employee"}
                </button>
            </div>
                
        </form>
    )
}

export default EmployeeForm
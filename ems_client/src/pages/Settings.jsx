import { useEffect, useState } from "react"
import { dummyProfileData } from "../assets/assets"
import Loading from "../components/Loading"
import { Lock } from "lucide-react"
import ProfileForm from "../components/ProfileForm"
import ChangePasswordModel from "../components/ChangePasswordModel"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import api from "../api/axios"
import ShiftPolicySettings from "../components/settings/ShiftPolicySettings"
import HolidaySettings from "../components/settings/HolidaySettings"
import { withMinLoader } from "../utils/loaderDelay"

const Settings = () => {
  const {user} = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await withMinLoader(() => api.get("/profile"));
      const profile = res.data;
      if (profile) {
        setProfile(profile);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  if(loading) return <Loading/>

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account and preferences</p>
      </div>

      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

      <div className="mt-6">
        <HolidaySettings readOnly={user?.role !== "ADMIN"} />
        {user?.role === "ADMIN" && <ShiftPolicySettings />}
      </div>
      
      {/* Password Card */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm max-w-md p-6 flex items-center justify-between hover:border-zinc-300 transition-colors group">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-lg group-hover:bg-zinc-100 transition-colors">
            <Lock className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Password</p>
            <p className="text-sm text-zinc-500 mt-0.5">Update your account password</p>
          </div>
        </div>

        {/* 🔥 SIGNATURE BLACK PREMIUM HOVER ADDED 🔥 */}
        <button 
          onClick={()=> setShowPasswordModal(true)} 
          className="px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          Change
        </button>
        
      </div>
      
      <ChangePasswordModel open={showPasswordModal} onClose={()=>setShowPasswordModal(false)}/>
    </div>
  )
}

export default Settings
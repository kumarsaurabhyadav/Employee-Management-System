import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loading from "../Loading";
import { withMinLoader } from "../../utils/loaderDelay";
import { Settings2Icon, ClockIcon, TimerIcon, GlobeIcon, Loader2Icon, SaveIcon, Building2Icon, ChevronDownIcon } from "lucide-react";

// Helper Functions
const toMinutes = (hhmm) => {
  const [hh, mm] = String(hhmm || "").split(":").map((x) => Number(x));
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
};

const toHHMM = (mins) => {
  if (!Number.isFinite(mins)) return "09:00";
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const ShiftPolicySettings = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [savingDept, setSavingDept] = useState(null);
  
  const [activeDept, setActiveDept] = useState("");

  const policiesByDept = useMemo(() => {
    const map = new Map();
    for (const p of policies) map.set(p.department, p);
    return map;
  }, [policies]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await withMinLoader(() => api.get("/shifts"));
      const fetchedDepts = Array.isArray(res.data?.departments) ? res.data.departments : [];
      setPolicies(Array.isArray(res.data?.data) ? res.data.data : []);
      setDepartments(fetchedDepts);
      
      if (fetchedDepts.length > 0 && !activeDept) {
          setActiveDept(fetchedDepts[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load shift policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [draft, setDraft] = useState({});
  
  useEffect(() => {
    const next = {};
    for (const dept of departments) {
      const p = policiesByDept.get(dept);
      next[dept] = {
        start: toHHMM(p?.shiftStartMinutes ?? 9 * 60), 
        end: toHHMM(p?.shiftEndMinutes ?? 18 * 60),   
        grace: String(p?.lateGraceMinutes ?? 15),     
        timezone: p?.timezone ?? "Asia/Kolkata",
      };
    }
    setDraft(next);
  }, [departments, policiesByDept]);

  const saveDept = async (department) => {
    const d = draft[department];
    const start = toMinutes(d?.start);
    const end = toMinutes(d?.end);
    const grace = Number(d?.grace);
    
    if (start == null || end == null) {
      toast.error("Please select valid Start and End times.");
      return;
    }
    if (!Number.isFinite(grace)) {
      toast.error("Invalid grace minutes");
      return;
    }

    setSavingDept(department);
    try {
      await api.put(`/shifts/${encodeURIComponent(department)}`, {
        timezone: d?.timezone,
        shiftStartMinutes: start,
        shiftEndMinutes: end,
        lateGraceMinutes: grace,
      });
      toast.success(`${department} shift policy updated!`);
      await fetchPolicies();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to save shift policy");
    } finally {
      setSavingDept(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full mb-8 bg-white border border-zinc-200 rounded-xl shadow-sm p-10 flex flex-col items-center justify-center animate-fade-in">
         <Loader2Icon className="w-8 h-8 text-zinc-400 animate-spin mb-4" />
         <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Policies...</p>
      </div>
    );
  }

  const d = draft[activeDept] || {};
  const isSaving = savingDept === activeDept;

  return (
    // 🚀 FIX: Added mb-8 here so that the Password component below it doesn't stick to it!
    <div className="w-full mb-8 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-fade-in">
      
      {/* -------- Header & Dropdown -------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                <Settings2Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">Shift & Grace Time</h2>
                <p className="text-sm font-medium text-zinc-500 mt-0.5">
                    Manage work hours and timezone policies.
                </p>
            </div>
        </div>

        {/* The Dropdown */}
        {departments.length > 0 && (
            <div className="relative w-full sm:w-64">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <Building2Icon className="w-4 h-4" />
                </div>
                <select
                    value={activeDept}
                    onChange={(e) => setActiveDept(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 appearance-none focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all cursor-pointer"
                >
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            </div>
        )}
      </div>

      <hr className="border-zinc-100 mb-6" />

      {/* -------- Form Body -------- */}
      {departments.length === 0 ? (
          <div className="text-center py-6">
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No departments configured</p>
          </div>
      ) : (
          <div>
            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                
                {/* Shift Start */}
                <div className="border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        <ClockIcon className="w-3.5 h-3.5" /> Shift Start Time
                    </label>
                    <input
                        type="time"
                        value={d.start || ""}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [activeDept]: { ...prev[activeDept], start: e.target.value } }))}
                        className="w-full text-base sm:text-lg font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0"
                    />
                </div>

                {/* Shift End */}
                <div className="border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        <ClockIcon className="w-3.5 h-3.5" /> Shift End Time
                    </label>
                    <input
                        type="time"
                        value={d.end || ""}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [activeDept]: { ...prev[activeDept], end: e.target.value } }))}
                        className="w-full text-base sm:text-lg font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0"
                    />
                </div>

                {/* Grace Time */}
                <div className="border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors relative">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        <TimerIcon className="w-3.5 h-3.5" /> Late Grace Period
                    </label>
                    <div className="flex items-center justify-between">
                        <input
                            type="number"
                            min="0"
                            value={d.grace || ""}
                            onChange={(e) => setDraft((prev) => ({ ...prev, [activeDept]: { ...prev[activeDept], grace: e.target.value } }))}
                            className="w-full text-base sm:text-lg font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0"
                        />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-1">Mins</span>
                    </div>
                </div>

                {/* Timezone */}
                <div className="border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors">
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        <GlobeIcon className="w-3.5 h-3.5" /> Timezone
                    </label>
                    <input
                        type="text"
                        value={d.timezone || ""}
                        onChange={(e) => setDraft((prev) => ({ ...prev, [activeDept]: { ...prev[activeDept], timezone: e.target.value } }))}
                        placeholder="e.g. Asia/Kolkata"
                        className="w-full text-base sm:text-lg font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => saveDept(activeDept)}
                    disabled={isSaving}
                    className="px-6 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2Icon className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <SaveIcon className="w-4 h-4" />
                            Save {activeDept} Settings
                        </>
                    )}
                </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default ShiftPolicySettings;
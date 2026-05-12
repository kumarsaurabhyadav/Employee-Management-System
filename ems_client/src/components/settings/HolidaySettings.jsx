import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { withMinLoader } from "../../utils/loaderDelay";
import { Loader2Icon, CalendarIcon } from "lucide-react";

const HolidaySettings = ({ readOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await withMinLoader(() => api.get("/holidays"));
      setHolidays(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const addHoliday = async (e) => {
    e.preventDefault();
    if (!date || !name) return;
    setSaving(true);
    try {
      await withMinLoader(() => api.post("/holidays", { date, name, type: "HOLIDAY" }));
      toast.success("Holiday added successfully");
      setDate("");
      setName("");
      await fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to add holiday");
    } finally {
      setSaving(false);
    }
  };

  const removeHoliday = async (id) => {
    try {
      await withMinLoader(() => api.delete(`/holidays/${id}`));
      toast.success("Holiday deleted");
      await fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to delete holiday");
    }
  };

  return (
    // 🚀 THE FIX: w-full and mb-8 added. This stretches it completely and leaves a nice gap below it!
    <div className="w-full mb-8 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8 animate-fade-in">
      
      {/* -------- Header -------- */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight">Holiday Calendar</h2>
        <p className="text-sm font-medium text-zinc-500 mt-0.5">
          {readOnly
            ? "Company holidays — attendance reminders are skipped on these dates."
            : "Configure company holidays. Attendance reminder emails are skipped on holidays/weekends."}
        </p>
      </div>

      {/* -------- Inputs & Add Button -------- */}
      {!readOnly && (
        <form onSubmit={addHoliday} className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
          
          {/* Date Input Card */}
          <div className="flex-1 border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-base font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0"
              required
            />
          </div>

          {/* Name Input Card */}
          <div className="flex-[2] border border-zinc-200 rounded-xl p-3.5 hover:border-zinc-300 transition-colors">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Independence Day"
              className="w-full text-base font-bold text-zinc-900 bg-transparent outline-none border-none p-0 focus:ring-0 placeholder:text-zinc-400 placeholder:font-medium"
              required
            />
          </div>

          {/* Add Button */}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 sm:py-0 text-[11px] font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center shrink-0 min-w-[100px]"
          >
            {saving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "ADD"}
          </button>
        </form>
      )}

      {/* -------- Holidays List -------- */}
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-6">
              <Loader2Icon className="w-6 h-6 text-zinc-400 animate-spin" />
          </div>
        ) : holidays.length === 0 ? (
          <p className="text-sm font-medium text-zinc-500 mt-2">No holidays added yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {holidays.map((h) => (
              <div key={h._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-zinc-100 rounded-lg text-zinc-500">
                      <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{h.name}</p>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                      {new Date(h.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeHoliday(h._id)}
                    className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default HolidaySettings;
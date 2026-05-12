import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { withMinLoader } from "../utils/loaderDelay";
import { ClockIcon, CheckIcon, XIcon } from "lucide-react";
import Loading from "../components/Loading";

const Overtime = () => {
  const { user } = useAuth();
  const isAdminOrManager = ["ADMIN", "MANAGER"].includes(user?.role);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [date, setDate] = useState("");
  const [hours, setHours] = useState("1");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withMinLoader(() =>
        api.get(isAdminOrManager ? "/overtime?status=PENDING" : "/overtime")
      );
      setRows(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load overtime");
    } finally {
      setLoading(false);
    }
  }, [isAdminOrManager]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const submit = async (e) => {
    e.preventDefault();
    if (!date || !reason) return;
    setSubmitting(true);
    try {
      await api.post("/overtime", { date, hours: Number(hours), reason });
      toast.success("Overtime request submitted");
      setDate("");
      setHours("1");
      setReason("");
      await fetchRows();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const review = async (id, status) => {
    try {
      await api.patch(`/overtime/${id}`, { status });
      toast.success(`Request ${status.toLowerCase()}`);
      await fetchRows();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to update request");
    }
  };


  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-zinc-900 rounded-xl shadow-sm">
            <ClockIcon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-zinc-900">Overtime Tracking</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">
            {isAdminOrManager ? "Review and approve pending overtime requests." : "Log your extra hours and track request status."}
            </p>
        </div>
      </div>

      {!isAdminOrManager && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-8 max-w-3xl">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4 mb-5">Log Overtime Hours</h2>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-medium transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Total Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-medium transition-all outline-none"
                min={1}
                max={12}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Work Description</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the tasks completed during overtime..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-medium transition-all outline-none resize-none placeholder:text-zinc-400"
                rows={3}
                required
              />
            </div>
            <div className="sm:col-span-3 flex justify-end pt-2 border-t border-zinc-100 mt-2">
              <button
                disabled={submitting}
                className="px-6 py-3 text-[13px] font-bold uppercase tracking-widest text-white bg-zinc-900 rounded-xl hover:bg-black shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <p className="text-base font-bold text-zinc-900">
            {isAdminOrManager ? "Pending Requests" : "Your History"}
          </p>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-200/60">
            {rows.length} {rows.length === 1 ? 'RECORD' : 'RECORDS'}
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                  <ClockIcon className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">No Overtime Records</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">There are currently no records to display here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <div key={r._id || r.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-zinc-50/50 transition-colors">
                
                <div className="flex-1">
                  {isAdminOrManager && (
                    <p className="text-[15px] font-bold text-zinc-900 capitalize mb-1">
                      {r.employee?.firstName} {r.employee?.lastName}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                    <span className="bg-zinc-100 px-2 py-1 rounded text-zinc-700">{new Date(r.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    <span>•</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{r.hours} Hours</span>
                    {!isAdminOrManager && (
                        <>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded ${r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : r.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                {r.status}
                            </span>
                        </>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 font-medium bg-zinc-50/50 p-3 rounded-lg border border-zinc-100 leading-snug">
                    <span className="text-zinc-400 font-bold mr-2 uppercase text-[10px] tracking-widest">Reason:</span>
                    {r.reason}
                  </p>
                </div>

                {isAdminOrManager && (
                  <div className="flex gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <button
                      onClick={() => review(r._id || r.id, "APPROVED")}
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} /> Approve
                    </button>
                    <button
                      onClick={() => review(r._id || r.id, "REJECTED")}
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200/50 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <XIcon className="w-3.5 h-3.5" strokeWidth={3} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overtime;
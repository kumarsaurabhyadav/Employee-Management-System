import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { withMinLoader } from "../utils/loaderDelay";
import { FileCheck2Icon, CheckIcon, XIcon, FileWarningIcon, ClockIcon } from "lucide-react";

const Approvals = () => {
  const { user } = useAuth();
  const isAdminOrManager = ["ADMIN", "MANAGER"].includes(user?.role);

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await withMinLoader(() => api.get("/corrections?status=PENDING"));
      setRequests(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminOrManager) fetchRequests();
  }, [fetchRequests, isAdminOrManager]);

  const review = async (id, status) => {
    try {
      await api.patch(`/corrections/${id}`, { status });
      toast.success(`Request ${status.toLowerCase()}`);
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to update request");
    }
  };

  if (!isAdminOrManager) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <FileWarningIcon className="w-12 h-12 text-zinc-300 mb-3" />
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Not Authorized</p>
      </div>
    );
  }

  // 🚀 THE FIX: Top level Full-Screen Loader
  if (loading) return <Loading />;

  // Helper function to format time without seconds
  const formatTime = (dateString) => {
      if (!dateString) return "—";
      return new Date(dateString).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit'
      });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-zinc-900 rounded-xl shadow-sm">
            <FileCheck2Icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-zinc-900">Approvals</h1>
            <p className="text-sm font-medium text-zinc-500 mt-1">Pending attendance correction requests</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <p className="text-base font-bold text-zinc-900">Correction Requests</p>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-200/60">
            {requests.length} {requests.length === 1 ? 'PENDING' : 'PENDING'}
          </span>
        </div>

        {requests.length === 0 ? (
          // 🚀 THE FIX: Premium Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                  <CheckIcon className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">All Caught Up!</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">There are no pending requests to review right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {requests.map((r) => (
              <div key={r._id || r.id} className="p-6 flex flex-col hover:bg-zinc-50/50 transition-colors">
                
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  
                  {/* Left Side: Employee Info */}
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-zinc-900 capitalize mb-1">
                      {r.employee?.firstName} {r.employee?.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                        <span className="bg-zinc-100 px-2 py-1 rounded text-zinc-700">
                            {new Date(r.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-500">{r.employee?.department || 'N/A'}</span>
                    </div>

                    {/* Check-In / Out Display */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-lg">
                            <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Req. Check-In</p>
                                <p className="text-[13px] font-bold text-zinc-900 mt-1 leading-none">{formatTime(r.requestedCheckIn)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-lg">
                            <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Req. Check-Out</p>
                                <p className="text-[13px] font-bold text-zinc-900 mt-1 leading-none">{formatTime(r.requestedCheckOut)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reason Box */}
                    <p className="text-sm text-zinc-600 font-medium bg-zinc-50/50 p-3 rounded-lg border border-zinc-100 leading-snug">
                        <span className="text-zinc-400 font-bold mr-2 uppercase text-[10px] tracking-widest">Reason:</span>
                        {r.reason}
                    </p>
                  </div>

                  {/* Right Side: Action Buttons */}
                  <div className="flex gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto">
                    <button
                      onClick={() => review(r._id || r.id, "APPROVED")}
                      className="flex-1 sm:flex-none justify-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} /> Approve
                    </button>
                    <button
                      onClick={() => review(r._id || r.id, "REJECTED")}
                      className="flex-1 sm:flex-none justify-center px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200/50 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <XIcon className="w-3.5 h-3.5" strokeWidth={3} /> Reject
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
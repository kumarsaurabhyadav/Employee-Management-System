import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { withMinLoader } from "../../utils/loaderDelay";
import { ClockIcon, CalendarIcon, XIcon, MessageSquareIcon } from "lucide-react"; // 🚀 Premium Icons

const toISODate = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Extract HH:MM from an existing Date string
const extractTime = (dateStr) => {
    if (!dateStr) return "";
    const dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) return "";
    return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
};

const RequestCorrectionModal = ({ open, onClose, record, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");

  const dateValue = useMemo(() => (record?.date ? toISODate(record.date) : ""), [record]);

  // 🚀 FIX: Reset and Pre-fill data when modal opens
  useEffect(() => {
      if (open && record) {
          setCheckIn(extractTime(record.checkIn));
          setCheckOut(extractTime(record.checkOut));
          setReason(""); // Clear previous reason
      }
  }, [open, record]);

  const submit = async (e) => {
    e.preventDefault();
    if (!dateValue) return;
    if (!reason.trim()) {
      toast.error("Reason is required to process correction");
      return;
    }

    const mkDateTime = (hhmm) => {
      if (!hhmm) return null;
      return new Date(`${dateValue}T${hhmm}:00`);
    };

    setLoading(true);
    try {
      await withMinLoader(() =>
        api.post("/corrections", {
          date: dateValue,
          requestedCheckIn: mkDateTime(checkIn),
          requestedCheckOut: mkDateTime(checkOut),
          reason,
        })
      );
      toast.success("Correction request submitted successfully");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/40 backdrop-blur-sm animate-fade-in"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Request Correction</h3>
                <div className="flex items-center gap-1.5 mt-1 text-zinc-500">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-bold uppercase tracking-widest">{dateValue || "—"}</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                disabled={loading}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={submit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {/* 🚀 FIX: Type="time" used for proper native picker */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                <ClockIcon className="w-3.5 h-3.5" /> Correct Check-in
              </label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-semibold text-zinc-900 transition-all outline-none"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                <ClockIcon className="w-3.5 h-3.5" /> Correct Check-out
              </label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-semibold text-zinc-900 transition-all outline-none"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                <MessageSquareIcon className="w-3.5 h-3.5" /> Reason for Correction
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-sm font-medium text-zinc-900 transition-all outline-none resize-none placeholder:text-zinc-400"
              placeholder="e.g. Forgot to clock out before leaving..."
              rows={3}
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-3 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest text-white bg-zinc-900 border border-zinc-900 hover:bg-black hover:border-black shadow-sm transition-all disabled:opacity-70 disabled:hover:bg-zinc-900 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>Processing...</>
              ) : (
                  <>Submit Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCorrectionModal;
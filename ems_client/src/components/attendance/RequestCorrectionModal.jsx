import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { withMinLoader } from "../../utils/loaderDelay";

const toISODate = (d) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const RequestCorrectionModal = ({ open, onClose, record, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");

  const dateValue = useMemo(() => (record?.date ? toISODate(record.date) : ""), [record]);

  const submit = async (e) => {
    e.preventDefault();
    if (!dateValue) return;
    if (!reason.trim()) {
      toast.error("Reason is required");
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
      toast.success("Correction request submitted");
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl border border-zinc-200 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-zinc-900">Request attendance correction</h3>
        <p className="text-sm text-zinc-500 mt-1">Date: {dateValue || "—"}</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Check-in (HH:MM)
              </label>
              <input
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                placeholder="09:30"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Check-out (HH:MM)
              </label>
              <input
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                placeholder="18:15"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
              rows={3}
              disabled={loading}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-zinc-900 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCorrectionModal;


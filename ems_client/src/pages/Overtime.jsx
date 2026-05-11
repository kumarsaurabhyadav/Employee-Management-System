import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { withMinLoader } from "../utils/loaderDelay";

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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Overtime</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {isAdminOrManager ? "Approve pending overtime requests" : "Request and track overtime"}
        </p>
      </div>

      {!isAdminOrManager && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 mb-6 max-w-2xl">
          <h2 className="text-sm font-semibold text-zinc-900">New request</h2>
          <form onSubmit={submit} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                min={1}
                max={12}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-zinc-700 mb-1">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                rows={3}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <button
                disabled={submitting}
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white bg-black rounded-lg hover:bg-zinc-800 disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit request"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-900">
            {isAdminOrManager ? "Pending requests" : "Your requests"}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60">
            {rows.length} records
          </span>
        </div>

        {loading ? (
          <Loading embedded />
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-zinc-500">No records.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <div key={r._id || r.id} className="p-6 flex items-start justify-between gap-4">
                <div>
                  {isAdminOrManager && (
                    <p className="font-semibold text-zinc-900">
                      {r.employee?.firstName} {r.employee?.lastName}
                    </p>
                  )}
                  <p className="text-sm text-zinc-500">
                    {new Date(r.date).toLocaleDateString()} • {r.hours}h • {r.status}
                  </p>
                  <p className="text-sm text-zinc-700 mt-2">{r.reason}</p>
                </div>

                {isAdminOrManager && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(r._id || r.id, "APPROVED")}
                      className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white bg-black rounded-lg hover:bg-zinc-800"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => review(r._id || r.id, "REJECTED")}
                      className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
                    >
                      Reject
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


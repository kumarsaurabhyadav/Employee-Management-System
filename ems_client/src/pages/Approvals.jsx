import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { withMinLoader } from "../utils/loaderDelay";

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
      <div className="animate-fade-in">
        <p className="text-sm text-zinc-500">Not authorized.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Approvals</h1>
        <p className="text-sm text-zinc-500 mt-1">Pending attendance correction requests</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-900">Correction Requests</p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60">
            {requests.length} pending
          </span>
        </div>

        {loading ? (
          <Loading embedded />
        ) : requests.length === 0 ? (
          <div className="p-6 text-sm text-zinc-500">No pending requests.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {requests.map((r) => (
              <div key={r._id || r.id} className="p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {r.employee?.firstName} {r.employee?.lastName}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(r.date).toLocaleDateString()} • {r.employee?.department}
                    </p>
                  </div>
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
                </div>

                <div className="text-sm text-zinc-700">
                  <p>
                    <span className="font-semibold text-zinc-900">Requested check-in:</span>{" "}
                    {r.requestedCheckIn ? new Date(r.requestedCheckIn).toLocaleTimeString() : "—"}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-900">Requested check-out:</span>{" "}
                    {r.requestedCheckOut ? new Date(r.requestedCheckOut).toLocaleTimeString() : "—"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-zinc-900">Reason:</span> {r.reason}
                  </p>
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


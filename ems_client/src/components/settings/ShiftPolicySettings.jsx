import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loading from "../Loading";
import { withMinLoader } from "../../utils/loaderDelay";

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

  const policiesByDept = useMemo(() => {
    const map = new Map();
    for (const p of policies) map.set(p.department, p);
    return map;
  }, [policies]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await withMinLoader(() => api.get("/shifts"));
      setPolicies(Array.isArray(res.data?.data) ? res.data.data : []);
      setDepartments(Array.isArray(res.data?.departments) ? res.data.departments : []);
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load shift policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
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
      toast.error("Invalid time format (use HH:MM)");
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
      toast.success("Shift policy updated");
      await fetchPolicies();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to save shift policy");
    } finally {
      setSavingDept(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <Loading embedded />
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 max-w-3xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-900">Shift & Grace Time</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Department-wise shift start/end and late grace minutes.
        </p>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => {
          const d = draft[dept] || {};
          const saving = savingDept === dept;
          return (
            <div
              key={dept}
              className="border border-zinc-200 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-zinc-900">{dept}</p>
                <button
                  onClick={() => saveDept(dept)}
                  disabled={saving}
                  className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white bg-black rounded-lg hover:bg-zinc-800 disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Start (HH:MM)
                  </label>
                  <input
                    value={d.start || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [dept]: { ...prev[dept], start: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    End (HH:MM)
                  </label>
                  <input
                    value={d.end || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [dept]: { ...prev[dept], end: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Grace (min)
                  </label>
                  <input
                    type="number"
                    value={d.grace || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [dept]: { ...prev[dept], grace: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Timezone
                  </label>
                  <input
                    value={d.timezone || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [dept]: { ...prev[dept], timezone: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftPolicySettings;


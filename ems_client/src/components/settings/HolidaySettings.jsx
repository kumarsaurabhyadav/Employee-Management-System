import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loading from "../Loading";
import { withMinLoader } from "../../utils/loaderDelay";

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
      toast.success("Holiday added");
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
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 max-w-3xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-900">Holiday Calendar</h2>
        <p className="text-sm text-zinc-500 mt-1">
          {readOnly
            ? "Company holidays — attendance reminders are skipped on these dates."
            : "Configure company holidays. Attendance reminder emails are skipped on holidays/weekends."}
        </p>
      </div>

      {!readOnly && (
        <form onSubmit={addHoliday} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 mb-1">Name</label>
            <div className="flex gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm"
                placeholder="e.g. Independence Day"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white bg-black rounded-lg hover:bg-zinc-800 disabled:opacity-70"
              >
                {saving ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-5">
        {loading ? (
          <Loading embedded />
        ) : holidays.length === 0 ? (
          <p className="text-sm text-zinc-500">No holidays added yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {holidays.map((h) => (
              <div key={h._id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-900">{h.name}</p>
                  <p className="text-sm text-zinc-500">
                    {new Date(h.date).toLocaleDateString()}
                  </p>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeHoliday(h._id)}
                    className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
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

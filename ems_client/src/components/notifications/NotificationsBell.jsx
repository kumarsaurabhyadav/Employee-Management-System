import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { BellIcon, XIcon } from "lucide-react";

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications?limit=50");
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
      setUnread(Number(res.data?.unreadCount || 0));
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 30000);
    return () => clearInterval(t);
  }, []);

  const markRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      await fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed");
    }
  };

  const markAll = async () => {
    try {
      await api.post("/notifications/read-all");
      await fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message || "Failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          fetchNotifications();
        }}
        className="relative inline-flex shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <BellIcon className="h-5 w-5 text-zinc-700" aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[1.125rem] rounded-full bg-zinc-900 px-1 py-0.5 text-center text-[10px] font-bold leading-none text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/45 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 p-4 sm:p-5">
              <div className="min-w-0">
                <p id="notifications-title" className="font-bold text-zinc-900">
                  Notifications
                </p>
                <p className="text-sm text-zinc-500">
                  {unread === 0 ? "All caught up" : `${unread} unread`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={markAll}
                  disabled={unread === 0}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700 transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  Mark all
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                  aria-label="Close notifications"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading…</p>
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-zinc-700">No notifications yet</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Approvals and reminders will show up here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((n) => (
                    <li key={n._id}>
                      <button
                        type="button"
                        onClick={() => markRead(n._id)}
                        className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 ${
                          n.readAt
                            ? "border-zinc-200 bg-white hover:bg-zinc-50"
                            : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                        }`}
                      >
                        <p className="font-semibold text-zinc-900">{n.title}</p>
                        {n.body ? (
                          <p className="mt-1 line-clamp-3 text-sm text-zinc-600">{n.body}</p>
                        ) : null}
                        <p className="mt-2 text-xs text-zinc-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default NotificationsBell;


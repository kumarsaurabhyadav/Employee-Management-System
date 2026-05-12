import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { BellIcon, BellOffIcon, InfoIcon, CheckCheckIcon, Loader2Icon } from "lucide-react";
// Agar date-fns use kar rahe ho toh "formatDistanceToNow" se "14 mins ago" jaisa text aata hai
import { formatDistanceToNow } from "date-fns"; 

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  
  const dropdownRef = useRef(null);

  // Click outside to close Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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

  // Safe time formatter
  const getTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return new Date(dateString).toLocaleDateString();
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      
      {/* 🚀 THE BELL BUTTON */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 active:scale-95 group
          ${open ? 'bg-zinc-100 shadow-inner' : 'bg-transparent hover:bg-zinc-100'}
        `}
      >
        <BellIcon className={`h-5 w-5 transition-colors ${open ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-zinc-900'}`} />
        
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black tracking-widest text-white shadow-sm ring-2 ring-zinc-50">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* 🚀 THE COMPACT & SPACIOUS DROPDOWN CONTAINER */}
      {open && (
        <div className="absolute right-0 mt-3 w-[360px] sm:w-[440px] bg-white rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-zinc-200 overflow-hidden z-50 animate-slide-down origin-top-right flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Notifications</h3>
            {unread > 0 && (
                <button 
                  onClick={markAll}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  Mark all as read
                </button>
            )}
          </div>

          {/* Scrollable Body (Increased Height) */}
          <div className="max-h-[480px] overflow-y-auto overscroll-contain">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <Loader2Icon className="w-6 h-6 text-zinc-400 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                      <BellOffIcon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <p className="text-base font-bold text-zinc-800">You're all caught up!</p>
                  <p className="mt-1.5 text-xs font-medium text-zinc-500">No new notifications at the moment.</p>
                </div>
            ) : (
                <ul className="divide-y divide-zinc-50">
                  {items.map((n) => {
                    const isRead = !!n.readAt;
                    return (
                      <li key={n._id}>
                        <button
                          type="button"
                          onClick={() => markRead(n._id)}
                          disabled={isRead}
                          className={`w-full flex items-start gap-4 p-5 text-left transition-colors
                            ${isRead ? "bg-white hover:bg-zinc-50" : "bg-blue-50/30 hover:bg-blue-50/60"}
                          `}
                        >
                          {/* Left Icon Avatar */}
                          <div className={`mt-0.5 shrink-0 w-11 h-11 rounded-full flex items-center justify-center border
                            ${isRead ? "bg-zinc-50 border-zinc-200 text-zinc-400" : "bg-white border-blue-100 text-blue-500 shadow-sm"}
                          `}>
                             {isRead ? <CheckCheckIcon className="w-4.5 h-4.5" /> : <InfoIcon className="w-4.5 h-4.5" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-2">
                              <p className={`text-[15px] tracking-tight ${isRead ? "text-zinc-600 font-semibold" : "text-zinc-900 font-bold"}`}>
                                {n.title}
                              </p>
                              {n.body && (
                                <p className={`mt-1 text-[13px] line-clamp-2 leading-snug ${isRead ? "text-zinc-500 font-medium" : "text-zinc-600"}`}>
                                  {n.body}
                                </p>
                              )}
                              <p className="mt-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                {getTimeAgo(n.createdAt)}
                              </p>
                          </div>
                          
                          {/* Unread Dot */}
                          {!isRead && (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
            )}
          </div>

          {/* Sticky Footer */}
          {items.length > 0 && (
              <div className="border-t border-zinc-100 bg-zinc-50 p-3 shrink-0">
                  <button 
                    onClick={async () => {
                      try {
                        await api.delete("/notifications/clear-all");
                        setItems([]);
                        setUnread(0);
                        setOpen(false);
                        toast.success("All notifications cleared");
                      } catch (err) {
                        toast.error(err.response?.data?.error || err?.message || "Failed to clear notifications");
                      }
                    }}
                    className="w-full py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-colors"
                  >
                      Clear notifications
                  </button>
              </div>
          )}

        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
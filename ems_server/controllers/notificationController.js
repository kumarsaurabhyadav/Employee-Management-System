import Notification from "../models/Notification.js";

// GET /api/notifications
export const listNotifications = async (req, res) => {
  try {
    const session = req.session;
    const limit = Number(req.query.limit || 50);
    const rows = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 200))
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: session.userId,
      readAt: null,
    });

    return res.json({ data: rows, unreadCount });
  } catch {
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// POST /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const session = req.session;
    await Notification.updateOne(
      { _id: req.params.id, userId: session.userId },
      { $set: { readAt: new Date() } },
    );
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to update notification" });
  }
};

// POST /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    const session = req.session;
    await Notification.updateMany(
      { userId: session.userId, readAt: null },
      { $set: { readAt: new Date() } },
    );
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to update notifications" });
  }
};

// DELETE /api/notifications/clear-all
export const clearAllNotifications = async (req, res) => {
  try {
    const session = req.session;
    await Notification.deleteMany({ userId: session.userId });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to clear notifications" });
  }
};


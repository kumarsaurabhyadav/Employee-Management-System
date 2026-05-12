import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  listNotifications,
  markAllRead,
  markNotificationRead,
  clearAllNotifications,
} from "../controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", protect, listNotifications);
notificationRouter.post("/read-all", protect, markAllRead);
notificationRouter.post("/:id/read", protect, markNotificationRead);
notificationRouter.delete("/clear-all", protect, clearAllNotifications);

export default notificationRouter;


import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  listNotifications,
  markAllRead,
  markNotificationRead,
} from "../controllers/notificationController.js";

const notificationRouter = Router();

notificationRouter.get("/", protect, listNotifications);
notificationRouter.post("/read-all", protect, markAllRead);
notificationRouter.post("/:id/read", protect, markNotificationRead);

export default notificationRouter;


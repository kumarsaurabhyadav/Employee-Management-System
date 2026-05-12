import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createOvertimeRequest,
  listOvertimeRequests,
  reviewOvertimeRequest,
} from "../controllers/overtimeController.js";

const overtimeRouter = Router();

overtimeRouter.post("/", protect, createOvertimeRequest);
overtimeRouter.get("/", protect, listOvertimeRequests);
overtimeRouter.patch("/:id", protect, reviewOvertimeRequest);

export default overtimeRouter;


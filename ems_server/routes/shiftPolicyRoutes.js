import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  listShiftPolicies,
  upsertShiftPolicy,
} from "../controllers/shiftPolicyController.js";

const shiftRouter = Router();

shiftRouter.get("/", protect, listShiftPolicies);
shiftRouter.put("/:department", protect, protectAdmin, upsertShiftPolicy);

export default shiftRouter;


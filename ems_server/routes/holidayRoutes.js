import { Router } from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  createHoliday,
  deleteHoliday,
  listHolidays,
} from "../controllers/holidayController.js";

const holidayRouter = Router();

holidayRouter.get("/", protect, listHolidays);
holidayRouter.post("/", protect, protectAdmin, createHoliday);
holidayRouter.delete("/:id", protect, protectAdmin, deleteHoliday);

export default holidayRouter;


import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createCorrectionRequest,
  listCorrectionRequests,
  reviewCorrectionRequest,
} from "../controllers/correctionController.js";

const correctionRouter = Router();

correctionRouter.post("/", protect, createCorrectionRequest);
correctionRouter.get("/", protect, listCorrectionRequests);
correctionRouter.patch("/:id", protect, reviewCorrectionRequest);

export default correctionRouter;


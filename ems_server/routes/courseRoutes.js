import { Router } from "express";
import { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse, completeCourse, getMyCourses, getCertificate, regenerateCertificate, getAllCertificates, getCourseStats } from "../controllers/courseController.js";
import { protect, protectAdmin } from "../middleware/auth.js";
import { autoGenerateCourse } from "../controllers/aiController.js";

const courseRouter = Router();

courseRouter.get("/", protect, getCourses);
courseRouter.get("/stats", protect, getCourseStats);
courseRouter.get("/my", protect, getMyCourses);
courseRouter.get("/certificates", protect, protectAdmin, getAllCertificates);
courseRouter.post("/", protect, protectAdmin, createCourse);
courseRouter.get("/:id/certificate", protect, getCertificate);
courseRouter.post("/:id/certificate/regenerate", protect, regenerateCertificate);
courseRouter.put("/:id", protect, protectAdmin, updateCourse);
courseRouter.post("/:id/enroll", protect, enrollCourse);
courseRouter.post("/:id/complete", protect, completeCourse);
courseRouter.delete("/:id", protect, protectAdmin, deleteCourse);
courseRouter.post("/generate-ai", protect, protectAdmin, autoGenerateCourse);

export default courseRouter;

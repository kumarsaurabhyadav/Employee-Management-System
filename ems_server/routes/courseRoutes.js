import { Router } from "express";
import { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse, completeCourse, getMyCourses, getCertificate, regenerateCertificate, getAllCertificates } from "../controllers/courseController.js";
import { protect, protectAdmin } from "../middleware/auth.js";

const courseRouter = Router();

courseRouter.get("/", protect, getCourses);
courseRouter.get("/my", protect, getMyCourses);
courseRouter.get("/certificates", protect, protectAdmin, getAllCertificates);
courseRouter.post("/", protect, protectAdmin, createCourse);
courseRouter.get("/:id/certificate", protect, getCertificate);
courseRouter.post("/:id/certificate/regenerate", protect, regenerateCertificate);
courseRouter.put("/:id", protect, protectAdmin, updateCourse);
courseRouter.post("/:id/enroll", protect, enrollCourse);
courseRouter.post("/:id/complete", protect, completeCourse);
courseRouter.delete("/:id", protect, protectAdmin, deleteCourse);

export default courseRouter;

import { generateCourseContent } from "../services/aiService.js";
import Course from "../models/Course.js";

export const autoGenerateCourse = async (req, res) => {
  try {
    const { topic, requirement, type = "slide", userId } = req.body;
    const prompt = requirement || topic;

    if (!prompt) {
      return res.status(400).json({ error: "Please provide a short requirement or topic to generate a course." });
    }

    // 1. AI Generation call
    const aiData = await generateCourseContent(prompt, type);

    const courseData = {
      ...aiData,
      status: "draft",
      generatedByAI: true,
      generatedFrom: prompt,
    };

    const creatorId = req.session?.userId || userId;
    if (creatorId) {
      courseData.createdBy = creatorId;
    }

    let savedCourse = null;
    try {
      savedCourse = await Course.create(courseData);
    } catch (dbError) {
      console.warn("AI_CONTROLLER_DB_WARNING: could not save course", dbError.message);
    }

    return res.status(200).json({
      success: true,
      generated: aiData,
      savedCourse,
      message: savedCourse ? "Course generated and saved." : "Course generated, but not saved to the database.",
    });
  } catch (error) {
    // 🚀 Ye log terminal mein asli error dikhayega
    console.error("AI_CONTROLLER_ERROR:", error); 
    res.status(500).json({ 
      error: "Failed to generate course automatically",
      details: error.message 
    });
  }
};
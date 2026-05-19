import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    duration: { type: String, default: "0h 0m" },
    level: { type: String, default: "Beginner" },
    learningObjectives: [{ type: String }],
    modules: [
      {
        title: { type: String, required: true },
        content: { type: String, default: "" },
        duration: { type: String, default: "" },
        keyPoints: [{ type: String }],
        slides: [
          {
            title: { type: String, required: true },
            bullets: [{ type: String }],
          },
        ],
      },
    ],
    videos: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    rating: { type: Number, default: 0 },
    generatedByAI: { type: Boolean, default: false },
    generatedFrom: { type: String, default: null },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      enrolled: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          enrolledAt: { type: Date, default: Date.now },
          progress: { type: Number, default: 0 },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date },
          certificatePath: { type: String, default: null },
          certificateFileName: { type: String, default: null },
          certificateMimeType: { type: String, default: null },
          certificateGeneratedAt: { type: Date, default: null },
        }
      ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);

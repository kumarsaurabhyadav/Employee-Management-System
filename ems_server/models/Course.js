import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    duration: { type: String, default: "0h 0m" },
    videos: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    rating: { type: Number, default: 0 },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      enrolled: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          enrolledAt: { type: Date, default: Date.now },
          progress: { type: Number, default: 0 },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date },
          certificatePath: { type: String, default: null }
        }
      ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);

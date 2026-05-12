import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    details: { type: Object, default: {} },
  },
  { timestamps: true },
);

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;


import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetVisitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor" },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);

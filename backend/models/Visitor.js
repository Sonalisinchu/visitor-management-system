import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    photoUrl: String,
    idProofType: String,
    idProofNumber: String,
    company: String,
    purposeOfVisit: String,
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "checked_in", "checked_out"],
      default: "pending",
    },
    checkInTime: Date,
    checkOutTime: Date,
    qrCode: String,
    preRegistered: { type: Boolean, default: false },
    scheduledTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);

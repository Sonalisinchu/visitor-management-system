import Visitor from "../models/Visitor.js";
import AuditLog from "../models/AuditLog.js";
import { generateQRCode } from "../utils/generateQR.js";
import sendEmail from "../utils/sendEmail.js";

const logAction = async (action, performedBy, targetVisitor, metadata = {}) => {
  await AuditLog.create({ action, performedBy, targetVisitor, metadata });
};

// @desc  Pre-register a visitor (host invites)
// @route POST /api/visitors/preregister
export const preRegisterVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create({
      ...req.body,
      hostId: req.user.role === "host" ? req.user._id : req.body.hostId,
      preRegistered: true,
      status: "approved",
    });

    visitor.qrCode = await generateQRCode({ visitorId: visitor._id });
    await visitor.save();

    if (visitor.email) {
      await sendEmail({
        to: visitor.email,
        subject: "You're invited — Visitor Pass",
        html: `<p>Hi ${visitor.name}, you're pre-approved to visit. Show this QR code at the front desk.</p><img src="${visitor.qrCode}" />`,
      });
    }

    await logAction("PRE_REGISTER", req.user._id, visitor._id);
    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Walk-in check-in by security
// @route POST /api/visitors/checkin
export const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create({
      ...req.body,
      createdBy: req.user._id,
      status: "pending",
      checkInTime: new Date(),
    });

    await logAction("CHECK_IN_REQUEST", req.user._id, visitor._id);

    // TODO: emit socket.io event "visitor:pending" to the host room here

    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  List visitors with filters
// @route GET /api/visitors
export const getVisitors = async (req, res) => {
  try {
    const { status, hostId, search, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (hostId) filter.hostId = hostId;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // Hosts only see their own visitors
    if (req.user.role === "host") filter.hostId = req.user._id;

    const visitors = await Visitor.find(filter)
      .populate("hostId", "name email department")
      .sort({ createdAt: -1 });

    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Currently active visitors (checked in, not out)
// @route GET /api/visitors/active
export const getActiveVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: "checked_in" }).populate("hostId", "name department");
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Approve visitor (host)
// @route PATCH /api/visitors/:id/approve
export const approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "checked_in", checkInTime: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    await logAction("APPROVE", req.user._id, visitor._id);
    // TODO: emit socket.io event "visitor:approved" to security room

    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Reject visitor (host)
// @route PATCH /api/visitors/:id/reject
export const rejectVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    await logAction("REJECT", req.user._id, visitor._id, { reason: req.body.reason });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Checkout visitor
// @route PATCH /api/visitors/:id/checkout
export const checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "checked_out", checkOutTime: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    await logAction("CHECK_OUT", req.user._id, visitor._id);
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

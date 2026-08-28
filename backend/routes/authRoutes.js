import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", protect, authorize("admin"), registerUser);
router.get("/me", protect, getMe);

// One-time bootstrap route to create the very first admin (disable/remove after first use)
router.post("/bootstrap-admin", async (req, res) => {
  const User = (await import("../models/User.js")).default;
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }
  const generateToken = (await import("../utils/generateToken.js")).default;
  const user = await User.create({ ...req.body, role: "admin" });
  res.status(201).json({ _id: user._id, email: user.email, token: generateToken(user._id) });
});

export default router;

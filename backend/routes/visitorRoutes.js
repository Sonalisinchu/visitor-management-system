import express from "express";
import {
  preRegisterVisitor,
  checkInVisitor,
  getVisitors,
  getActiveVisitors,
  approveVisitor,
  rejectVisitor,
  checkoutVisitor,
} from "../controllers/visitorController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/preregister", authorize("host", "admin"), preRegisterVisitor);
router.post("/checkin", authorize("security", "admin"), checkInVisitor);
router.get("/", getVisitors);
router.get("/active", getActiveVisitors);
router.patch("/:id/approve", authorize("host", "admin"), approveVisitor);
router.patch("/:id/reject", authorize("host", "admin"), rejectVisitor);
router.patch("/:id/checkout", authorize("security", "admin"), checkoutVisitor);

export default router;

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/**
 * GET /api/notifications
 * Get all notifications for logged-in user (client)
 */
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

export default router;

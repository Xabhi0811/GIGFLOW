import Notification from "../models/Notification.js";

/**
 * GET MY NOTIFICATIONS
 */
export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

/**
 * MARK AS READ
 */
export const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  if (notification.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true });
};

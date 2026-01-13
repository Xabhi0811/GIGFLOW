import Bid from "../models/Bid.js";
import Notification from "../models/Notification.js";
import Gig from "../models/Gig.js";
import { userSocketMap } from "../utils/socketMap.js";
import { getIO } from "../utils/socket.js";

/**
 * FREELANCER → CREATE BID
 */
export const createBid = async (req, res) => {
  const { gigId, price, message } = req.body;

  if (!gigId || !price || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user._id,
    clientId: gig.clientId,
    price,
    message,
    status: "pending",
  });

  const notification = await Notification.create({
    userId: gig.clientId,
    type: "new_bid",
    message: `${req.user.name} sent a proposal`,
    gigId,
    bidId: bid._id,
  });

  // 🔔 SOCKET PUSH
  const io = getIO();
  const socketId = userSocketMap.get(gig.clientId.toString());
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
  }

  res.status(201).json(bid);
};

/**
 * GET MY BIDS (CLIENT + FREELANCER)
 */
export const getMyBids = async (req, res) => {
  let bids;

  if (req.user.userType === "freelancer") {
    bids = await Bid.find({ freelancerId: req.user._id })
      .populate("gigId");
  } else {
    bids = await Bid.find({ clientId: req.user._id })
      .populate("freelancerId", "name email")
      .populate("gigId");
  }

  res.json(bids);
};

/**
 * CLIENT → ACCEPT BID
 */
export const acceptBid = async (req, res) => {
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = "accepted";
  await bid.save();

  const notification = await Notification.create({
    userId: bid.freelancerId,
    type: "bid_accepted",
    message: "🎉 Your proposal was accepted!",
    gigId: bid.gigId,
    bidId: bid._id,
  });

  const io = getIO();
  const socketId = userSocketMap.get(bid.freelancerId.toString());
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
  }

  res.json({ success: true });
};

/**
 * CLIENT → REJECT BID
 */
export const rejectBid = async (req, res) => {
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = "rejected";
  await bid.save();

  const notification = await Notification.create({
    userId: bid.freelancerId,
    type: "bid_rejected",
    message: "❌ Your proposal was rejected",
    gigId: bid.gigId,
    bidId: bid._id,
  });

  const io = getIO();
  const socketId = userSocketMap.get(bid.freelancerId.toString());
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
  }

  res.json({ success: true });
};

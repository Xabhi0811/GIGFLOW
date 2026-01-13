import Bid from "../models/Bid.js";
import Notification from "../models/Notification.js";
import Gig from "../models/Gig.js";
import { userSocketMap } from "../utils/socketMap.js";
import { getIO } from "../utils/socket.js";


export const createBid = async (req, res) => {
  const { gigId, price, message } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user._id,
    clientId: gig.clientId,
    price,
    message,
  });

  const notification = await Notification.create({
    userId: gig.clientId,
    type: "new_bid",
    message: `${req.user.name} sent a proposal`,
    gigId,
  });

  // 🔥 REAL-TIME PUSH
  const io = getIO();
  const clientSocketId = userSocketMap.get(gig.clientId.toString());

  if (clientSocketId) {
    io.to(clientSocketId).emit("new-notification", notification);
  }

  res.status(201).json(bid);
};

export const getMyBids = async (req, res) => {
  let bids;

  if (req.user.userType === "freelancer") {
    bids = await Bid.find({ freelancerId: req.user._id }).populate("gigId");
  } else {
    bids = await Bid.find()
      .populate({
        path: "gigId",
        match: { clientId: req.user._id },
      })
      .populate("freelancerId");

    bids = bids.filter(b => b.gigId);
  }

  res.json(bids);
};

export const getBidsForGig = async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId })
    .populate("freelancerId", "name email");

  res.json(bids);
};

export const hireFreelancer = async (req, res) => {
  const bid = await Bid.findById(req.params.id);
  bid.status = "hired";
  await bid.save();

  res.json(bid);
};


export const acceptBid = async (req, res) => {
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = "accepted";
  await bid.save();

  const notification = await Notification.create({
    userId: bid.freelancerId,
    type: "bid_accepted",
    gigId: bid.gigId,
    message: "🎉 Your proposal was accepted!",
  });

  const io = getIO();
  const socketId = userSocketMap.get(bid.freelancerId.toString());
  if (socketId) {
    io.to(socketId).emit("new-notification", notification);
  }

  res.json({ success: true });
};

export const rejectBid = async (req, res) => {
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = "rejected";
  await bid.save();

  res.json({ success: true });
};


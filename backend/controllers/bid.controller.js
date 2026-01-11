import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";

/**
 * POST /api/bids
 * Submit a bid on a gig
 */
export const createBid = async (req, res) => {
  const { gigId, message, price } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig || gig.status !== "open") {
    return res.status(400).json({ message: "Gig not available" });
  }

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user._id,
    message,
    price,
  });

  res.status(201).json(bid);
};

/**
 * GET /api/bids/:gigId
 * Only gig owner can view bids
 */


export const getBidsForGig = async (req, res) => {
  const { gigId } = req.params;

  // ✅ VALIDATION
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    return res.status(400).json({ message: "Invalid gig ID" });
  }

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return res.status(404).json({ message: "Gig not found" });
  }

  if (gig.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const bids = await Bid.find({ gigId })
    .populate("freelancerId", "name email");

  res.json(bids);
};

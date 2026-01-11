import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { io } from "../server.js";
import { userSocketMap } from "../utils/socketMap.js";

/**
 * PATCH /api/bids/:bidId/hire
 */
export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) throw new Error("Gig not found");

    // 🔒 OWNER CHECK
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new Error("Unauthorized");
    }

    // 🔒 RACE CONDITION BLOCK
    if (gig.status === "assigned") {
      throw new Error("Gig already assigned");
    }

    // 1️⃣ Assign Gig
    gig.status = "assigned";
    await gig.save({ session });

    // 2️⃣ Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // 3️⃣ Reject all other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    //  REAL-TIME NOTIFICATION
    const socketId = userSocketMap.get(bid.freelancerId.toString());
    if (socketId) {
      io.to(socketId).emit("hired", {
        message: `You have been hired for "${gig.title}"`,
      });
    }

    res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

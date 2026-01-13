import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { io } from "../server.js";
import { userSocketMap } from "../utils/socketMap.js";


export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) throw new Error("Gig not found");

    
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new Error("Unauthorized");
    }

    
    if (gig.status === "assigned") {
      throw new Error("Gig already assigned");
    }

   
    gig.status = "assigned";
    await gig.save({ session });

   
    bid.status = "hired";
    await bid.save({ session });

    
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    
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

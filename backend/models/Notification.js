import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["new_bid", "bid_accepted", "bid_rejected"],
      required: true,
    },
    message: String,
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,

    status: {
      type: String,
      default: "open",
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Gig", gigSchema);

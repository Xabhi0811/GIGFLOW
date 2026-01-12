import Bid from "../models/Bid.js";

export const createBid = async (req, res) => {
  const bid = await Bid.create({
    ...req.body,
    freelancerId: req.user._id,
  });
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

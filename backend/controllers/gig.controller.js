import Gig from "../models/Gig.js";

/**
 * GET /api/gigs
 * Fetch all open gigs with optional search
 */
export const getGigs = async (req, res) => {
  const { search } = req.query;

  const query = {
    status: "open",
    ...(search && {
      title: { $regex: search, $options: "i" },
    }),
  };

  const gigs = await Gig.find(query)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 });

  res.json(gigs);
};

/**
 * POST /api/gigs
 * Create a new gig
 */
export const createGig = async (req, res) => {
  const { title, description, budget } = req.body;

  if (!title || !description || !budget) {
    return res.status(400).json({ message: "All fields required" });
  }

  const gig = await Gig.create({
    title,
    description,
    budget,
    ownerId: req.user._id,
  });

  res.status(201).json(gig);
};

export const getMyGigs = async (req, res) => {
  const gigs = await Gig.find({ ownerId: req.user._id })
    .populate({
      path: "bids",
      populate: {
        path: "freelancerId",
        select: "name email",
      },
    });

  res.json(gigs);
};
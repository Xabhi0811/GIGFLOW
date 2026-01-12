import Gig from "../models/Gig.js";

/**
 * GET /api/gigs
 * Freelancer: browse all gigs
 */
export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("clientId", "name email")
      .populate({
        path: "bids",
        populate: {
          path: "freelancerId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("getAllGigs error:", error);
    res.status(500).json({ message: "Failed to fetch gigs" });
  }
};

/**
 * POST /api/gigs
 * Client: create gig
 */
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      clientId: req.user._id,
      status: "open",
    });

    res.status(201).json(gig);
  } catch (error) {
    console.error("createGig error:", error);
    res.status(500).json({ message: "Failed to create gig" });
  }
};

/**
 * GET /api/gigs/my
 * Client: get own gigs
 */
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ clientId: req.user._id })
      .populate({
        path: "bids",
        populate: {
          path: "freelancerId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error("getMyGigs error:", error);
    res.status(500).json({ message: "Failed to fetch my gigs" });
  }
};

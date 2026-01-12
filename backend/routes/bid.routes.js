import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createBid,
  getBidsForGig,
  getMyBids,
  hireFreelancer
} from "../controllers/bid.controller.js";

const router = express.Router();

// Freelancer: place bid
router.post("/", protect, createBid);

// Client/Freelancer: my bids (THIS FIXES 400)
router.get("/my", protect, getMyBids);

// Client: view bids for a gig
router.get("/:gigId", protect, getBidsForGig);

// Client: hire freelancer
router.patch("/:id/hire", protect, hireFreelancer);

export default router;

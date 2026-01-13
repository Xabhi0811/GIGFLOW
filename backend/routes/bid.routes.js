import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createBid,
  getMyBids,
  acceptBid,
  rejectBid,
} from "../controllers/bid.controller.js";

const router = express.Router();

// Freelancer → create bid
router.post("/", protect, createBid);

// Client + Freelancer → view my bids
router.get("/my", protect, getMyBids);

// Client → accept / reject bid
router.patch("/:id/accept", protect, acceptBid);
router.patch("/:id/reject", protect, rejectBid);

export default router;

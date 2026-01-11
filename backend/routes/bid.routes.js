import express from "express";
import {
  createBid,
  getBidsForGig,
} from "../controllers/bid.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBid);
router.get("/:gigId", protect, getBidsForGig);

export default router;

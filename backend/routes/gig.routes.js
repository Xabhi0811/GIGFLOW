import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getAllGigs,
  createGig,
  getMyGigs,
} from "../controllers/gig.controller.js";

const router = express.Router();

router.get("/", getAllGigs);
router.post("/", protect, createGig);
router.get("/my", protect, getMyGigs);

export default router;

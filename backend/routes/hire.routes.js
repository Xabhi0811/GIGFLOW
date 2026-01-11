import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { hireFreelancer } from "../controllers/hire.controller.js";

const router = express.Router();

router.patch("/:bidId/hire", protect, hireFreelancer);

export default router;

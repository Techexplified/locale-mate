import express from "express";
import {
  generateCampaign,
  getCampaigns,
  getCampaignById,
  deleteCampaign,
} from "../controllers/campaignController.js";

const router = express.Router();

// Route for generation and saving
router.post("/generate", generateCampaign);

// Route for retrieving all campaigns
router.get("/", getCampaigns);

// Routes for a single campaign
router.get("/:id", getCampaignById);
router.delete("/:id", deleteCampaign);

export default router;

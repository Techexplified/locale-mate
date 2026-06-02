import prisma from "../lib/prisma.js";
import { generateCampaignContent } from "../services/openrouterService.js";

/**
 * Generate a new localized marketing campaign
 */
export async function generateCampaign(req, res) {
  const { title, market, productType, goal, tone, platform } = req.body;

  if (!title || !market) {
    return res.status(400).json({
      success: false,
      error: "Campaign Title and Target Market are required fields.",
    });
  }

  try {
    // Generate AI content using OpenRouter
    const generatedContent = await generateCampaignContent({
      title,
      market,
      productType,
      goal,
      tone,
      platform,
    });

    // Save to the PostgreSQL database via Prisma
    const campaign = await prisma.campaign.create({
      data: {
        title,
        market,
        productType: productType || "General",
        goal: goal || "Conversions",
        tone: tone || "Engaging",
        platform: platform || "All platforms",
        generatedContent,
      },
    });

    return res.status(201).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Controller Error in generateCampaign:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate campaign.",
    });
  }
}

/**
 * Retrieve all generated campaigns
 */
export async function getCampaigns(req, res) {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Controller Error in getCampaigns:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch campaigns.",
    });
  }
}

/**
 * Retrieve a specific campaign by ID
 */
export async function getCampaignById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid campaign ID.",
    });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Controller Error in getCampaignById:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch campaign details.",
    });
  }
}

/**
 * Delete a specific campaign by ID
 */
export async function deleteCampaign(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid campaign ID.",
    });
  }

  try {
    await prisma.campaign.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    console.error("Controller Error in deleteCampaign:", error);
    // Prisma errors out if record to delete is not found
    return res.status(500).json({
      success: false,
      error: error.code === "P2025" ? "Campaign not found." : "Failed to delete campaign.",
    });
  }
}
